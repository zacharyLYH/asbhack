import os
import re
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
Extract all relevant information from this LinkedIn profile and return it as a clean JSON array of strings. Each string should contain a specific piece of information from the profile.

Extract the following types of information:
- Name
- Headline/Bio
- Location
- Profile Image URL
- Experience (title, company, duration, description, location)
- Education (institution, degree, field, duration, description)
- Skills
- Projects (title, description, duration, technologies, url)
- Awards (title, issuer, date, description)
- Publications (title, publisher, date, description, url)
- Patents (title, patent number, date, description)
- Certifications (name, issuer, date, expiry date, credential ID, url)
- Languages (name, proficiency level)
- Volunteer Experience (role, organization, duration, description)

Return ONLY a valid JSON array with clean strings in this format:
["Satya Nadella", "Chairman and CEO at Microsoft", "Redmond, Washington, United States", "Chairman and CEO at Microsoft (Feb 2014 - Present) - Greater Seattle Area", "The University of Chicago Booth School of Business (1994 - 1996)", "Artificial Intelligence", "Deep Learning"]

Do not include any markdown formatting, code blocks, or extra text. Do not prefix each string with labels like "Name:" or "Headline:". Just return the raw values as clean strings in a JSON array.

Include multiple entries for categories that have multiple items (e.g., multiple experiences, skills, etc.).
Only include information that is actually present in the data.

Data:
{data}
"""
    
    # Configure Gemini API
    client = genai.Client(api_key=gemini_api_key)
    response = client.models.generate_content(
    model='gemini-2.0-flash-001', contents=prompt
    )
    
    return {
        "gemini_response": response.text
    }
