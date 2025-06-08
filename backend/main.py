from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import os
from llm import process_linkedin_url
import json
from dotenv import load_dotenv

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
        
        # Write URLs to file (one per line)
        urls_file_path = os.path.join(urls_dir, "url.txt")
        with open(urls_file_path, 'w') as f:
            for url in request.urls:
                f.write(f"{url.strip()}\n")
        
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
                
                # Try to parse the JSON response from Gemini
                try:
                    parsed_data = json.loads(response["gemini_response"])
                except json.JSONDecodeError:
                    # If JSON parsing fails, return raw response
                    parsed_data = {"raw_response": response["gemini_response"]}
                
                results.append(ProfileResponse(
                    url=url,
                    success=True,
                    data=parsed_data
                ))
                successful += 1
                
            except Exception as e:
                results.append(ProfileResponse(
                    url=url,
                    success=False,
                    error=str(e)
                ))
        print(results, len(urls), successful, len(urls) - successful, file=open("tempfile.txt", "w"))
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 
