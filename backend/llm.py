import os
import re
import json
from pathlib import Path
from google import genai
from google.genai import types
from typing import Optional

def extract_name_from_linkedin(url: str) -> Optional[str]:
    """
    Extract name from LinkedIn URL.
    Example: https://www.linkedin.com/in/john-doe/ -> john-doe
    """
    pattern = r"linkedin\.com/in/([^/]+)/?"
    match = re.search(pattern, url)
    return match.group(1) if match else None

def get_data_from_file(name: str) -> Optional[str]:
    """
    Get data from a text file that contains the name.
    """
    data_dir = Path("data/chopped/data")
    if not data_dir.exists():
        raise FileNotFoundError("Data directory not found")
    
    # Search for files containing the name
    for file_path in data_dir.glob("*.txt"):
        if name.lower() in file_path.stem.lower():
            return file_path.read_text()
    
    return None

def clean_gemini_response(response_text: str) -> str:
    """
    Clean Gemini response by removing markdown code blocks and extra formatting.
    """
    # Remove markdown code blocks
    response_text = re.sub(r'```json\s*', '', response_text)
    response_text = re.sub(r'```\s*$', '', response_text)
    response_text = response_text.strip()
    
    # Try to find JSON object or array in the response
    # First try to match a JSON object
    json_object_match = re.search(r'\{.*\}', response_text, re.DOTALL)
    if json_object_match:
        return json_object_match.group(0)
    
    # Then try to match a JSON array
    json_array_match = re.search(r'\[.*\]', response_text, re.DOTALL)
    if json_array_match:
        return json_array_match.group(0)
    
    return response_text

def process_linkedin_url(url: str, gemini_api_key: str) -> dict:
    """
    Process LinkedIn URL, get corresponding data, and call Gemini API.
    
    Args:
        url: LinkedIn profile URL
        gemini_api_key: Gemini API key
    
    Returns:
        dict: Response from Gemini API
    """
    # Extract name from LinkedIn URL
    name = extract_name_from_linkedin(url)
    if not name:
        raise ValueError("Invalid LinkedIn URL")
    
    # Get data from file
    data = get_data_from_file(name)
    if not data:
        raise ValueError(f"No data found for {name}")
    
    prompt = f"""
Extract all relevant information from this LinkedIn profile and return it as a well-structured JSON object with categorized information.

Return a JSON object with the following structure:
{{
  "name": "Full Name",
  "headline": "Professional headline/bio",
  "location": "City, State, Country",
  "experience": [
    {{
      "title": "Job Title",
      "company": "Company Name",
      "duration": "Start - End dates",
      "location": "Location",
      "description": "Job description if available"
    }}
  ],
  "education": [
    {{
      "institution": "School/University Name",
      "degree": "Degree type",
      "field": "Field of study",
      "duration": "Start - End dates",
      "description": "Additional details if available"
    }}
  ],
  "skills": ["Skill 1", "Skill 2", "Skill 3"],
  "projects": [
    {{
      "title": "Project Name",
      "description": "Project description",
      "duration": "Duration if available",
      "technologies": ["Tech 1", "Tech 2"],
      "url": "Project URL if available"
    }}
  ],
  "certifications": [
    {{
      "name": "Certification Name",
      "issuer": "Issuing Organization",
      "date": "Issue date",
      "expiryDate": "Expiry date if available",
      "credentialId": "ID if available",
      "url": "Verification URL if available"
    }}
  ],
  "patents": [
    {{
      "title": "Patent Title",
      "patentNumber": "Patent Number",
      "date": "Filing or Grant Date",
      "description": "Patent description",
    }}
  ],
  "publications": [
    {{
      "title": "Publication Title",
      "publisher": "Publisher",
      "date": "Publication Date",
      "description": "Abstract or description",
      "url": "Publication URL or DOI if available"
    }}
  ],
  "languages": [
    {{
      "name": "Language Name",
      "proficiency": "Proficiency Level"
    }}
  ],
  "volunteerExperience": [
    {{
      "role": "Volunteer Role",
      "organization": "Organization Name",
      "duration": "Duration",
      "description": "Description if available"
    }}
  ],
  "awards": [
    {{
      "title": "Award Title",
      "issuer": "Issuing Organization",
      "date": "Award date",
      "description": "Description if available"
    }}
  ]
}}

IMPORTANT: 
- Return ONLY valid JSON, no markdown code blocks, no extra text
- Include only information that is actually present in the data
- If a section has no data, use an empty array [] or empty string ""
- Ensure all JSON syntax is correct with proper quotes and commas

Data:
{data}
"""
    
    # Configure Gemini API
    client = genai.Client(api_key=gemini_api_key)
    response = client.models.generate_content(
    model='gemini-2.0-flash-001', contents=prompt
    )
    
    # Clean the response
    cleaned_response = clean_gemini_response(response.text)
    
    return {
        "gemini_response": cleaned_response
    }
