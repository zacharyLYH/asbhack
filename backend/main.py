from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import os
from llm import process_linkedin_url
import json
from dotenv import load_dotenv
from scheduler import scrape_a_few_profiles

# Load environment variables from .env file
load_dotenv()

app = FastAPI(title="LinkedIn Scraper API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure as needed for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class URLRequest(BaseModel):
    urls: List[str]

class SingleURLRequest(BaseModel):
    url: str

class URLResponse(BaseModel):
    message: str
    count: int

class ProfileResponse(BaseModel):
    url: str
    success: bool
    data: dict = None
    error: str = None

class ProcessResponse(BaseModel):
    results: List[ProfileResponse]
    total_processed: int
    successful: int
    failed: int

@app.post("/update-urls", response_model=URLResponse)
async def update_urls(request: URLRequest):
    """Update LinkedIn profile URLs in the url.txt file."""
    try:
        # Ensure the directory exists
        urls_dir = "data/urls"
        os.makedirs(urls_dir, exist_ok=True)

        #strip url
        request.urls = [url.strip() for url in request.urls]
        
        # Write URLs to file (one per line)
        urls_file_path = os.path.join(urls_dir, "url.txt")
        with open(urls_file_path, 'a') as f:
            for url in request.urls:
                print("WRITING URL: ", url)
                f.write(f"{url.strip()}\n")

        scrape_a_few_profiles(request.urls)
        print("SCRAPED PROFILES")
        process_single_profile(request.urls)
        print("PROCESSED PROFILES")
        
        return URLResponse(
            message="URLs updated successfully",
            count=len(request.urls)
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating URLs: {str(e)}")

@app.get("/")
async def root():
    """Health check endpoint."""
    return {"message": "LinkedIn Scraper API is running"}

def process_single_profile(urls: list[str]):
    """Process a single LinkedIn URL and extract profile information using Gemini API."""
    try:
        # Get Gemini API key from environment
        gemini_api_key = os.getenv("GEMINI_API_KEY")
        if not gemini_api_key:
            raise HTTPException(status_code=500, detail="GEMINI_API_KEY environment variable not set")
        
        for url in urls:
            try:
                # Process the URL using the LLM function
                response = process_linkedin_url(url, gemini_api_key)

                # Try to parse the JSON response from Gemini with better error handling
                try:
                    gemini_response = response["gemini_response"]
                    print("GEMINI RESPONSE: ", gemini_response)
                    print(f"Raw Gemini response for {url}: {gemini_response}")
                    
                    # Additional cleaning in case the LLM function didn't catch everything
                    if gemini_response.startswith('```') and gemini_response.endswith('```'):
                        gemini_response = gemini_response.strip('```').strip()
                        if gemini_response.startswith('json'):
                            gemini_response = gemini_response[4:].strip()
                    
                    parsed_data = json.loads(gemini_response)
                    print("PARSED DATA: ", parsed_data)
                    # Validate that we got a valid structure (object or list)
                    if not isinstance(parsed_data, (dict, list)):
                        raise ValueError("Response is not a valid JSON object or array")
                        
                except (json.JSONDecodeError, ValueError) as e:
                    print(f"JSON parsing failed for {url}: {e}")
                    print(f"Raw response: {response['gemini_response']}")
                    # If JSON parsing fails, return structured error info
                    parsed_data = {
                        "error": "Failed to parse JSON response",
                        "raw_response": response["gemini_response"],
                        "parse_error": str(e)
                    }
                
                # Add the processed profile to tempfile.txt
                if parsed_data and not parsed_data.get("error"):
                    try:
                        # Read existing profile data
                        existing_data = []
                        tempfile_path = "tempfile.txt"
                        
                        if os.path.exists(tempfile_path):
                            try:
                                with open(tempfile_path, 'r') as f:
                                    existing_data = json.load(f)
                            except (json.JSONDecodeError, FileNotFoundError):
                                existing_data = []
                        
                        # Add new profile data to existing data
                        existing_data.append(parsed_data)
                        
                        # Write updated data back to file
                        with open(tempfile_path, 'w') as f:
                            json.dump(existing_data, f, indent=2)
                            
                    except Exception as file_error:
                        print(f"Warning: Failed to update tempfile.txt: {file_error}")
                
                return ProfileResponse(
                    url=url,
                    success=True,
                    data=parsed_data
                )
            
            except Exception as e:
                print(f"Error processing {url}: {e}")
                return ProfileResponse(
                    url=url,
                    success=False,
                    error=str(e)
                )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing profile: {str(e)}")

@app.get("/process-profiles", response_model=ProcessResponse)
async def process_all_profiles():
    """Process all LinkedIn URLs and extract profile information using Gemini API."""
    try:
        # Get Gemini API key from environment
        gemini_api_key = os.getenv("GEMINI_API_KEY")
        print(gemini_api_key)
        if not gemini_api_key:
            raise HTTPException(status_code=500, detail="GEMINI_API_KEY environment variable not set")
        
        # Read URLs from file
        urls_file_path = os.path.join("data/urls", "url.txt")
        if not os.path.exists(urls_file_path):
            raise HTTPException(status_code=404, detail="No URLs file found. Please upload URLs first using /update-urls")
        
        with open(urls_file_path, 'r') as f:
            urls = [url.strip() for url in f.readlines() if url.strip()]
        
        if not urls:
            raise HTTPException(status_code=404, detail="No URLs found in file")
        
        results = []
        successful = 0
        
        for url in urls:
            try:
                # Process each URL using the LLM function
                response = process_linkedin_url(url, gemini_api_key)
                
                # Try to parse the JSON response from Gemini with better error handling
                try:
                    gemini_response = response["gemini_response"]
                    print(f"Raw Gemini response for {url}: {gemini_response}")
                    
                    # Additional cleaning in case the LLM function didn't catch everything
                    if gemini_response.startswith('```') and gemini_response.endswith('```'):
                        gemini_response = gemini_response.strip('```').strip()
                        if gemini_response.startswith('json'):
                            gemini_response = gemini_response[4:].strip()
                    
                    parsed_data = json.loads(gemini_response)
                    
                    # Validate that we got a valid structure (object or list)
                    if not isinstance(parsed_data, (dict, list)):
                        raise ValueError("Response is not a valid JSON object or array")
                        
                except (json.JSONDecodeError, ValueError) as e:
                    print(f"JSON parsing failed for {url}: {e}")
                    print(f"Raw response: {response['gemini_response']}")
                    # If JSON parsing fails, return structured error info
                    parsed_data = {
                        "error": "Failed to parse JSON response",
                        "raw_response": response["gemini_response"],
                        "parse_error": str(e)
                    }
                
                results.append(ProfileResponse(
                    url=url,
                    success=True,
                    data=parsed_data
                ))
                successful += 1
                
            except Exception as e:
                print(f"Error processing {url}: {e}")
                results.append(ProfileResponse(
                    url=url,
                    success=False,
                    error=str(e)
                ))
        
        # Extract just the data from successful responses
        profile_data = [result.data for result in results if result.success and result.data]
        with open("tempfile.txt", "w") as f:
            json.dump(profile_data, f, indent=2)
        
        return ProcessResponse(
            results=results,
            total_processed=len(urls),
            successful=successful,
            failed=len(urls) - successful
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing profiles: {str(e)}")

@app.get("/profiles")
async def read_cached_profile():
    """Read cached profile data."""
    try:
        # Read the JSON file using context manager for better file handling
        with open("tempfile.txt", 'r') as f:
            profile_data = json.load(f)
        
        return profile_data
    
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="No cached profile data found. Please process profiles first.")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Error parsing cached profile data")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading profile: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 
