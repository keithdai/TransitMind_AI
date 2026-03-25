from playwright.sync_api import sync_playwright
import os

output_dir = r"E:\vibecoding\TransitMind AI\test_screenshots"
os.makedirs(output_dir, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.set_viewport_size({"width": 1400, "height": 900})
    
    # Navigate to marketplace
    page.goto('http://localhost:3001/')
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(1000)
    page.screenshot(path=os.path.join(output_dir, 'marketplace.png'), full_page=False)
    print("Screenshot saved: marketplace.png")
    
    # Navigate to developer center
    page.goto('http://localhost:3001/developer')
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(1000)
    page.screenshot(path=os.path.join(output_dir, 'developer_center.png'), full_page=False)
    print("Screenshot saved: developer_center.png")
    
    browser.close()
    print("Done!")
