# 🏠 Real Estate Web Scraper

## 📌 Description

This project is a Python-based web scraper that collects apartment listing data from **imobiliare.ro**.

It extracts relevant information such as price, surface, number of rooms, floor details, location, and more, and stores the results in a CSV file for further analysis.

---

## ⚙️ Features

* Scrapes multiple pages (configurable)
* Handles cookies automatically
* Works in headless mode (no browser UI)
* Extracts structured real estate data
* Cleans and normalizes values (price, surface, floor, etc.)
* Removes duplicates within each run
* Appends data to an existing CSV file

---

## 📊 Extracted Data

Each listing includes:

* Scrape date
* Price (€)
* Price per m²
* Surface (m²)
* Number of rooms
* Floor / Total floors
* Neighborhood
* City
* Year built
* Listing URL

---

## 🚀 How to Run

### 1. Install dependencies

```bash
pip install selenium pandas webdriver-manager
```

### 2. Run the scraper

```bash
python main.py
```

---

## ⚙️ Configuration

You can modify these variables in `main.py`:

```python
PAGES_TO_SCRAPE = 335   # Number of pages to scrape
HEADLESS = True         # Run browser without UI
DEBUG = True            # Enable debug logs
WAIT_TIME = 15          # Wait time for page loading
OUTPUT_FILE = "imobiliare_data.csv"
```

---

## 📁 Output

* `imobiliare_data.csv` → contains all scraped data
* If the file already exists, new data will be appended

---

## 🧠 Technologies Used

* Python
* Selenium
* Pandas
* WebDriver Manager

---

## ⚠️ Notes

* The scraper uses a custom user-agent and anti-detection settings
* Website structure changes may break selectors
* Scraping a large number of pages may take time

