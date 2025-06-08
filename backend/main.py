from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import os

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 