import schedule
import time
from scrape_profile import login_to_linkedin, save_html
from selenium import webdriver
import os
from dotenv import load_dotenv
import shutil

def run_scraper():
    """Run the LinkedIn scraper."""
    print(f"Running scraper at {time.strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Delete all files in the data directory
    data_dir = "data"
    if os.path.exists(data_dir):
        shutil.rmtree(data_dir)
    os.makedirs(data_dir)
    print("Cleared data directory")
    
    driver = webdriver.Chrome()
    
    # Login with custom function
    if login_to_linkedin(driver, os.getenv("LINKEDIN_EMAIL"), os.getenv("LINKEDIN_PASSWORD")):
        # List of profiles to scrape
        profiles = [
            "https://www.linkedin.com/in/satyanadella/",
            "https://www.linkedin.com/in/williamhgates/",
            "https://www.linkedin.com/in/jeffweiner/"
        ]
        
        # Save HTML for each profile
        for profile_url in profiles:
            save_html(driver, profile_url)
            time.sleep(2)  # Small delay between profiles
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