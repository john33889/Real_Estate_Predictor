import re
import time
from datetime import datetime
import pandas as pd

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import (
    NoSuchElementException,
    StaleElementReferenceException
)
from webdriver_manager.chrome import ChromeDriverManager


# =====================================================
# CONFIG
# =====================================================

PAGES_TO_SCRAPE = 335
DEBUG = True
HEADLESS = True
WAIT_TIME = 15
OUTPUT_FILE = "imobiliare_data.csv"

scrape_date = datetime.now().strftime("%Y-%m-%d")

COLUMNS = [
    "scrape_date",
    "price",
    "price_per_m2",
    "surface_m2",
    "rooms",
    "floor",
    "max_floor",
    "neighborhood",
    "city",
    "year_built",
    "url"
]


# =====================================================
# DEBUG
# =====================================================

def debug(site, message):
    if DEBUG:
        print(f"[DEBUG][{site}] {message}")


# =====================================================
# CLEAN / PARSE FUNCTIONS
# =====================================================

def extract_integer(text):
    if not text:
        return None

    text = text.replace("\xa0", " ").strip()
    match = re.search(r"\d+", text)
    return int(match.group(0)) if match else None


def extract_price(text):
    """
    Extract only the first price-looking number.
    Prevents merging price + €/m² + old price into one huge number.
    """
    if not text:
        return None

    text = text.replace("\xa0", " ").strip()

    match = re.search(r"\d{1,3}(?:[.\s]\d{3})+|\d+", text)
    if not match:
        return None

    value = re.sub(r"[^\d]", "", match.group(0))
    return int(value) if value else None


def extract_surface(text):
    """
    Keeps decimal values:
    183.42 -> 183.42
    189,42 -> 189.42
    137 -> 137.0
    """
    if not text:
        return None

    text = text.replace("\xa0", " ").strip()
    match = re.search(r"\d+(?:[.,]\d+)?", text)
    if not match:
        return None

    return float(match.group(0).replace(",", "."))


def extract_floor_info(text):
    if not text:
        return None, None

    lowered = text.lower().strip().replace("\xa0", " ")
    lowered = lowered.replace("din", "/")
    lowered = re.sub(r"\s*/\s*", "/", lowered)

    if "parter" in lowered:
        numbers = re.findall(r"\d+", lowered)
        return (0, int(numbers[-1])) if numbers else (0, None)

    if "demisol" in lowered:
        numbers = re.findall(r"\d+", lowered)
        return (-1, int(numbers[-1])) if numbers else (-1, None)

    if "subsol" in lowered:
        numbers = re.findall(r"\d+", lowered)
        return (-2, int(numbers[-1])) if numbers else (-2, None)

    if "mansard" in lowered:
        numbers = re.findall(r"\d+", lowered)
        if len(numbers) >= 2:
            return int(numbers[0]), int(numbers[1])
        elif len(numbers) == 1:
            return int(numbers[0]), None
        return None, None

    numbers = re.findall(r"\d+", lowered)

    if len(numbers) >= 2:
        return int(numbers[0]), int(numbers[1])
    elif len(numbers) == 1:
        return int(numbers[0]), None

    return None, None


def extract_location(text):
    """
    Example:
    'Theodor Pallady, Sectorul 3, Bucuresti'
    -> neighborhood='Theodor Pallady', city='Bucuresti'
    """
    if not text:
        return None, None

    parts = [p.strip() for p in text.split(",") if p.strip()]

    if len(parts) >= 2:
        return parts[0], parts[-1]

    if len(parts) == 1:
        return parts[0], None

    return None, None


def compute_price_m2(price, surface):
    if price is not None and surface not in (None, 0):
        try:
            return round(price / surface)
        except ZeroDivisionError:
            return None
    return None


def normalize_url(url):
    if not url:
        return None
    return url.split("?")[0].rstrip("/")


def create_record(
    price=None,
    surface=None,
    rooms=None,
    floor=None,
    max_floor=None,
    neighborhood=None,
    city=None,
    year_built=None,
    url=None
):
    return [
        scrape_date,
        price,
        compute_price_m2(price, surface),
        surface,
        rooms,
        floor,
        max_floor,
        neighborhood,
        city,
        year_built,
        url
    ]


# =====================================================
# SAFE ELEMENT HELPER
# =====================================================

def safe_find_text(parent, by, selector, default=None, debug_label=None):
    try:
        el = parent.find_element(by, selector)
        text = el.get_attribute("textContent") or el.text
        return text.strip() if text else default
    except NoSuchElementException:
        if debug_label:
            debug(debug_label, f"NOT FOUND -> {selector}")
        return default
    except StaleElementReferenceException:
        if debug_label:
            debug(debug_label, f"STALE -> {selector}")
        return default
    except Exception as e:
        if debug_label:
            debug(debug_label, f"ERROR -> {selector} | {e}")
        return default


# =====================================================
# COOKIE HANDLER
# =====================================================

def try_accept_cookies(driver):
    possible_xpaths = [
        "//button[contains(., 'Accept')]",
        "//button[contains(., 'Accept all')]",
        "//button[contains(., 'Sunt de acord')]",
        "//button[contains(., 'Acceptă')]",
        "//button[contains(., 'AGREE')]",
        "//button[contains(., 'I agree')]",
    ]

    for xpath in possible_xpaths:
        try:
            btn = driver.find_element(By.XPATH, xpath)
            btn.click()
            return True
        except Exception:
            pass

    return False


# =====================================================
# DRIVER
# =====================================================

def build_driver():
    options = Options()

    if HEADLESS:
        options.add_argument("--headless=new")

    options.add_argument("--window-size=1920,1080")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_experimental_option("useAutomationExtension", False)

    options.add_argument(
        "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/122.0.0.0 Safari/537.36"
    )

    driver = webdriver.Chrome(
        service=Service(ChromeDriverManager().install()),
        options=options
    )

    driver.execute_script(
        "Object.defineProperty(navigator, 'webdriver', {get: () => undefined})"
    )

    return driver


# =====================================================
# IMOBILIARE.RO
# =====================================================

def scrape_imobiliare(driver, pages):
    site = "IMOBILIARE"
    data = []
    wait = WebDriverWait(driver, WAIT_TIME)

    print("\nScraping Imobiliare.ro")

    for page in range(1, pages + 1):
        if page == 1:
            url = "https://www.imobiliare.ro/vanzare-apartamente"
        else:
            url = f"https://www.imobiliare.ro/vanzare-apartamente?page={page}"

        print(f"\nPage requested: {page}")
        print(f"URL requested: {url}")

        try:
            driver.get(url)
            time.sleep(3)
            try_accept_cookies(driver)

            print(f"Current browser URL: {driver.current_url}")

            wait.until(
                EC.presence_of_all_elements_located(
                    (By.CSS_SELECTOR, "a[data-cy='listing-information-link']")
                )
            )

            listings = driver.find_elements(By.CSS_SELECTOR, "a[data-cy='listing-information-link']")
            print("Listings found:", len(listings))

            page_urls = []

            for i, listing in enumerate(listings, start=1):
                try:
                    container = listing.find_element(By.XPATH, "./..")

                    price = None
                    rooms = None
                    surface = None
                    floor = None
                    max_floor = None
                    neighborhood = None
                    city = None
                    year_built = None

                    try:
                        price_el = container.find_element(By.CSS_SELECTOR, "[data-cy='card-price']")
                        price_raw = price_el.get_attribute("textContent") or price_el.text
                        price_raw = price_raw.strip() if price_raw else ""
                        price = extract_price(price_raw)
                    except Exception as e:
                        debug(site, f"Listing #{i} price failed: {e}")

                    rooms_raw = safe_find_text(
                        container,
                        By.CSS_SELECTOR,
                        "[data-cy='card-bedroom_count']",
                        default=None,
                        debug_label=site
                    )
                    rooms = extract_integer(rooms_raw)

                    surface_raw = safe_find_text(
                        container,
                        By.CSS_SELECTOR,
                        "[data-cy='card-usable_surface']",
                        default=None,
                        debug_label=site
                    )
                    surface = extract_surface(surface_raw)

                    floor_raw = safe_find_text(
                        container,
                        By.CSS_SELECTOR,
                        "[data-cy='card-floor_number']",
                        default=None,
                        debug_label=None
                    )
                    floor, max_floor = extract_floor_info(floor_raw)

                    location_raw = safe_find_text(
                        container,
                        By.CSS_SELECTOR,
                        "p.w-full.truncate.font-normal.capitalize",
                        default=None,
                        debug_label=None
                    )
                    neighborhood, city = extract_location(location_raw)

                    year_built_raw = safe_find_text(
                        container,
                        By.CSS_SELECTOR,
                        "[data-cy='card-year_built']",
                        default=None,
                        debug_label=None
                    )
                    year_built = extract_integer(year_built_raw)

                    link = normalize_url(listing.get_attribute("href"))
                    page_urls.append(link)

                    data.append(create_record(
                        price=price,
                        surface=surface,
                        rooms=rooms,
                        floor=floor,
                        max_floor=max_floor,
                        neighborhood=neighborhood,
                        city=city,
                        year_built=year_built,
                        url=link
                    ))

                except Exception as e:
                    debug(site, f"Listing #{i} failed completely: {e}")

            unique_page_urls = len(set(u for u in page_urls if u))
            missing_page_urls = sum(1 for u in page_urls if not u)

            print(f"Unique URLs on page {page}: {unique_page_urls}")
            print(f"Missing URLs on page {page}: {missing_page_urls}")
            print("First 5 URLs on page:")
            for u in page_urls[:5]:
                print("   ", u)

        except Exception as e:
            debug(site, f"Page {page} failed: {e}")

    return data


# =====================================================
# MAIN
# =====================================================

import os


def main():
    driver = build_driver()

    try:
        imobiliare_data = scrape_imobiliare(driver, PAGES_TO_SCRAPE)
    finally:
        driver.quit()

    df = pd.DataFrame(imobiliare_data, columns=COLUMNS)

    print("\nRows scraped this run:", len(df))

    # remove duplicates only inside this run
    df = df.drop_duplicates(subset=["url"])

    print("Rows after removing duplicates in this run:", len(df))

    file_exists = os.path.exists(OUTPUT_FILE)

    if file_exists:
        df.to_csv(
            OUTPUT_FILE,
            mode="a",
            header=False,
            index=False,
            encoding="utf-8-sig"
        )
        print("Appended to existing file")

    else:
        df.to_csv(
            OUTPUT_FILE,
            mode="w",
            header=True,
            index=False,
            encoding="utf-8-sig"
        )
        print("Created new file")

    print("Saved to:", OUTPUT_FILE)


if __name__ == "__main__":
    main()