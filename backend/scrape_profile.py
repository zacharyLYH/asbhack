from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import os
from dotenv import load_dotenv
import time
from datetime import datetime

def login_to_linkedin(driver, email, password):
    """Custom login function for LinkedIn."""
    try:
        # Go to login page
        driver.get('https://www.linkedin.com/login')
        time.sleep(2)  # Wait for page to load

        # Enter email
        email_field = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "username"))
        )
        email_field.send_keys(email)

        # Enter password
        password_field = driver.find_element(By.ID, "password")
        password_field.send_keys(password)

        # Click login button
        login_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
        login_button.click()

        # Wait for either the feed to load (success) or an error message
        try:
            WebDriverWait(driver, 1000000000).until(
                EC.presence_of_element_located((By.CLASS_NAME, "feed-shared-update-v2"))
            )
            print("Login successful!")
            return True
        except TimeoutException:
            print("Waiting for manual 2FA or verification...")
            time.sleep(1000000)
            return True

    except Exception as e:
        print(f"Error during login: {str(e)}")
        return False

def save_html(driver, profile_url, output_dir="data"):
    """Save the HTML content of a profile page."""
    try:
        print(f"Navigating to profile: {profile_url}")
        driver.get(profile_url)
        time.sleep(10)  # Wait for page to load

        # Create output directory if it doesn't exist
        os.makedirs(output_dir, exist_ok=True)

        # Generate filename with timestamp
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        profile_id = profile_url.split("/in/")[-1].rstrip("/")
        filename = f"{output_dir}/{profile_id}_{timestamp}.html"

        # Save the page source
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(driver.page_source)
        
        print(f"HTML saved to {filename}")
        return filename

    except Exception as e:
        print(f"Error saving HTML: {str(e)}")
        return None
