import schedule
import time
from scrape_profile import login_to_linkedin, save_html
from selenium import webdriver
import os
from dotenv import load_dotenv
from chop import process_html_files, clean_root_directory

def run_scraper():
    """Run the LinkedIn scraper."""
    print(f"Running scraper at {time.strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Delete all files in the data directory
    clean_root_directory("data")
    
    driver = webdriver.Chrome()
    
    # Login with custom function
    if login_to_linkedin(driver, os.getenv("LINKEDIN_EMAIL"), os.getenv("LINKEDIN_PASSWORD")):
        # Read profiles from urls.txt file
        profiles = []
        urls_file_path = "data/urls/url.txt"
        
        try:
            if os.path.exists(urls_file_path):
                with open(urls_file_path, 'r') as f:
                    profiles = [line.strip() for line in f.readlines() if line.strip()]
            else:
                print("URLs file not found. Using empty profile list.")
        except Exception as e:
            print(f"Error reading URLs file: {e}. Using empty profile list.")
            profiles = []
        
        # Save HTML for each profile
        for profile_url in profiles:
            save_html(driver, profile_url)
            time.sleep(2)  # Small delay between profiles
        process_html_files("data", "data/chopped/data")
    else:
        print("Failed to login. Please check your credentials and try again.")
    
    driver.quit()

def main():
    load_dotenv()
    
    # Schedule the scraper to run every 10 minutes
    schedule.every(10).minutes.do(run_scraper)
    
    # Run immediately on startup
    run_scraper()
    
    # Keep the script running
    while True:
        schedule.run_pending()
        time.sleep(1)

if __name__ == "__main__":
    main() 