# Hotwheels-Exploratory

Explore Hot Wheels Releases — Your guide to upcoming Hot Wheels drops — all upcoming cars in one place.

![Hotwheels-Exploratory Screenshot](https://via.placeholder.com/800x400?text=Hotwheels-Exploratory+Screenshot)

## Table of Contents

1. [About](#about)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Data Sources](#data-sources)
5. [How to Run Locally](#how-to-run-locally)
6. [How to Add New Cars](#how-to-add-new-cars)
7. [Scripts Included](#scripts-included)
8. [Contributing](#contributing)
9. [License](#license)

## About

Hotwheels-Exploratory is a collector-focused web app for exploring upcoming Hot Wheels diecast releases. It aggregates release data from community sources so collectors can see one clean, deduplicated record per car — no redundant or conflicting entries.

Users can see upcoming Hot Wheels releases on the home page, search for any car by name and view a consolidated detail card, and get all details in one place: origin, real-world country, casting info, release date, availability (when it hits shelves / is expected), case info, Treasure Hunt status, and images. If a Hot Wheels car image is not shown, it auto-searches for a car image (diecast or real-car) and puts it inside the page pointing to that specific hotwheels car.

## Features

- **Home page** — Shows upcoming Hot Wheels releases sorted by expected release date
- **Global search bar** — Search cars by name/casting/series/origin/country
- **Car detail page** — One consolidated view per car: name, origin, country, casting year, series/line, case assignment, release date, availability status, Treasure Hunt/Super TH flag, images (diecast + real car), source links
- **Image fallback** — If no Hot Wheels diecast image is available, auto-fetch a real-car image and display it, pointing back to the specific car
- **Lineup filter** — Filter by Mainline, Silver, Gold, Base, RLC, Premium, Car Culture, Monster Jam, Fast & Furious
- **Type filter** — Filter by Muscle, Sports Car, Supercar, Truck, Coupe, Sedan
- **Data aggregation + dedup** — Pull from multiple sources, normalize fields, merge duplicates
- **Source attribution** — Show which site each piece of info came from
- **Dark theme** — Mobile-first responsive UI with orange accent colors

## Tech Stack

- **Frontend:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM
- **Icons:** Lucide React
- **Data:** Static JSON files (build-time, no backend)
- **Image fallback:** Wikimedia Commons (free, no API key needed)
- **Deployment:** Vercel / Netlify (static hosting)

## Data Sources

| Source | What It Provides |
|--------|-----------------|
| **HotWheelsHub** | Release dates, case letters (A, B, C…), monthly release updates, Treasure Hunt & Super TH trackers, new castings, premium/RLC drops |
| **Hot Wheels Fandom Wiki** | Individual car pages, casting history, origin/country info, first-release year |
| **Wikimedia Commons** | Real-car reference images for cars without diecast images |

*Note: No official Hot Wheels API exists. All data is aggregated from community sources.*

## How to Run Locally

```bash
# Clone the repository
git clone https://github.com/<your-username>/hotwheels-exploratory.git

# Navigate to the project folder
cd hotwheels-exploratory

# Install dependencies
npm install

# Start the development server
npm run dev

# Open http://localhost:5173 in your browser
```

## How to Add New Cars

Hot Wheels releases new cars throughout the year. To add new cars:

### Step 1 — Scrape for new cars
```powershell
node scripts/scrape-releases.mjs
```
This fetches HotWheelsHub release pages, extracts car names, compares with `cars.json`, and saves new finds to `scripts/new-cars-found.json`.

### Step 2 — Merge new cars
```powershell
node scripts/merge-new-cars.mjs
```
This merges new cars into `public/data/cars.json` with deduplication.

### Step 3 — Fetch images for new cars
```powershell
node scripts/fetch-images.mjs
```
This searches Wikimedia Commons for real-car images of cars missing images and updates `cars.json`.

### Step 4 — Manual review
Open `public/data/cars.json` and review the added cars. Add missing details (origin, country, series, etc.) where needed. Remove the `_needsReview` flag after review.

## Scripts Included

| Script | Purpose |
|--------|---------|
| `scripts/scrape-releases.mjs` | Scrapes HotWheelsHub release pages for new car names |
| `scripts/merge-new-cars.mjs` | Merges new cars into `public/data/cars.json` |
| `scripts/fetch-images.mjs` | Fetches real-car images from Wikimedia Commons |
| `scripts/fix-images.mjs` | Removes wrong/mismatched images from cars |

### Data Sources Scraped
- `https://hotwheelshub.com/2026-releases/`
- `https://hotwheelshub.com/2027-hot-wheels-releases/`
- `https://hotwheelshub.com/2026-hot-wheels-treasure-hunts/`
- `https://hotwheelshub.com/2027-hot-wheels-treasure-hunts/`

## Current State

| Metric | Value |
|--------|-------|
| Total cars | 44 |
| Cars with images | 30 |
| Cars with placeholders | 14 |
| Lineups | 10 (Mainline, Silver, Gold, Base, RLC, Premium, Car Culture, Monster Jam, Fast & Furious) |
| Types | 7 (Muscle, Sports Car, Supercar, Truck, Coupe, Sedan, All Lineups) |
| Build status | ✅ Clean, zero errors |

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## License

[MIT](LICENSE)

---

*Built for the Hot Wheels collector community. Not affiliated with Mattel or Hot Wheels.*
