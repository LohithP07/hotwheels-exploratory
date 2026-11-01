/**
 * HotWheels Release Scraper
 * =========================
 * Lightweight Node.js script that scrapes HotWheelsHub release pages,
 * cross-references with your local cars.json, and outputs new cars found.
 *
 * Usage: node scripts/scrape-releases.mjs
 *
 * No API keys, no backend, no database required.
 * Run this whenever you want to check for new releases.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const CARS_JSON_PATH = join(process.cwd(), 'public', 'data', 'cars.json');
const OUTPUT_PATH = join(process.cwd(), 'scripts', 'new-cars-found.json');

// HotWheelsHub release pages to scrape
const SOURCE_URLS = [
  'https://hotwheelshub.com/2026-releases/',
  'https://hotwheelshub.com/2027-hot-wheels-releases/',
  'https://hotwheelshub.com/2026-hot-wheels-treasure-hunts/',
  'https://hotwheelshub.com/2027-hot-wheels-treasure-hunts/',
];

/**
 * Fetch HTML from a URL with proper headers
 */
async function fetchHtml(url) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} for ${url}`);
    }

    return await response.text();
  } catch (err) {
    console.error(`  ⚠️  Failed to fetch ${url}: ${err.message}`);
    return null;
  }
}

/**
 * Extract car names from HTML using multiple strategies.
 * HotWheelsHub page structure varies, so we try several patterns.
 */
function extractCarNames(html) {
  const cars = new Set();

  if (!html) return cars;

  // Strategy 1: Look for car names in h2/h3 headings (release titles)
  const headingRegex = /<h[23][^>]*>([^<]+)<\/h[23]>/gi;
  let match;
  while ((match = headingRegex.exec(html)) !== null) {
    const title = match[1].trim();
    if (isLikelyCarName(title)) {
      cars.add(normalizeCarName(title));
    }
  }

  // Strategy 2: Look for links with car names in URL slugs
  const linkRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>([^<]+)<\/a>/gi;
  while ((match = linkRegex.exec(html)) !== null) {
    const url = match[1];
    const text = match[2].trim();

    // Check if URL looks like a car page
    if (
      (url.includes('/2026-') || url.includes('/2027-')) &&
      isLikelyCarName(text)
    ) {
      cars.add(normalizeCarName(text));
    }
  }

  // Strategy 3: Look for car names in "Case" contexts
  const caseRegex = /(?:Case\s+[A-Z]|Treasure\s+Hunt|Super\s+TH)[^<]{0,100}?(?:<h[23]|<a[^>]*>)([^<]{3,60})/gi;
  while ((match = caseRegex.exec(html)) !== null) {
    const title = match[1].trim();
    if (isLikelyCarName(title)) {
      cars.add(normalizeCarName(title));
    }
  }

  return cars;
}

/**
 * Check if a string looks like a car name (not navigation, etc.)
 */
function isLikelyCarName(text) {
  if (!text || text.length < 3 || text.length > 80) return false;

  const lower = text.toLowerCase();

  // Exclude common non-car text
  const exclude = [
    'home', 'about', 'contact', 'privacy', 'terms', 'search',
    'menu', 'navigation', 'skip to', 'fandom', 'wiki', 'sign in',
    'create account', 'advertisement', 'explore', 'history',
    'settings', 'more', 'view mobile', 'read more', 'track',
    'guide', 'hub', 'releases', 'treasure', 'super th', 'case',
    'buying', 'collector', 'premium', 'mainline', '2026', '2027',
    'updates', 'news', 'faq', 'disclosure', 'affiliate', 'join',
  ];

  if (exclude.some((e) => lower === e || lower.startsWith(e + ' '))) {
    return false;
  }

  // Must contain at least one letter
  if (!/[a-zA-Z]/.test(text)) return false;

  // Exclude purely numeric or case codes
  if (/^(Case\s+)?[A-Z]$/i.test(text.trim())) return false;

  return true;
}

/**
 * Normalize car name for comparison
 */
function normalizeCarName(name) {
  return name
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Load existing cars.json
 */
function loadExistingCars() {
  if (!existsSync(CARS_JSON_PATH)) {
    console.error(`❌  cars.json not found at ${CARS_JSON_PATH}`);
    process.exit(1);
  }

  const raw = readFileSync(CARS_JSON_PATH, 'utf-8');
  const cars = JSON.parse(raw);

  // Build set of existing normalized names
  const existingNames = new Set();
  for (const car of cars) {
    existingNames.add(normalizeCarName(car.name));
    if (car.castingName) {
      existingNames.add(normalizeCarName(car.castingName));
    }
  }

  return { cars, existingNames };
}

/**
 * Main scraping logic
 */
async function main() {
  console.log('🔍 HotWheels Release Scraper');
  console.log('============================\n');

  // Load existing cars
  const { cars: existingCars, existingNames } = loadExistingCars();
  console.log(`📦  Loaded ${existingCars.length} existing cars from cars.json\n`);

  // Fetch and scrape all source URLs
  const allFoundNames = new Set();

  for (const url of SOURCE_URLS) {
    console.log(`🌐  Scraping: ${url}`);
    const html = await fetchHtml(url);

    if (html) {
      const found = extractCarNames(html);
      console.log(`   Found ${found.size} potential car names`);
      for (const name of found) {
        allFoundNames.add(name);
      }
    }

    // Be polite - wait between requests
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }

  console.log(`\n📊  Total unique car names found: ${allFoundNames.size}\n`);

  // Cross-reference with existing cars
  const newCars = [];
  const alreadyExist = [];

  for (const name of allFoundNames) {
    if (existingNames.has(name)) {
      alreadyExist.push(name);
    } else {
      newCars.push(name);
    }
  }

  console.log(`✅  Already in database: ${alreadyExist.length}`);
  console.log(`🆕  New cars found: ${newCars.length}\n`);

  if (newCars.length > 0) {
    console.log('New cars:');
    for (const name of newCars) {
      console.log(`   • ${name}`);
    }

    // Generate new-cars-found.json for easy merging
    const newCarsData = newCars.map((name, index) => ({
      id: `new-${Date.now()}-${index}`,
      name: name.charAt(0).toUpperCase() + name.slice(1),
      castingName: null,
      origin: null,
      country: null,
      series: null,
      yearIntroduced: null,
      treasureHunt: false,
      superTreasureHunt: false,
      caseLetter: null,
      releaseDate: null,
      availability: 'Upcoming',
      images: {
        diecast: null,
        realCar: null,
        fallbackUsed: true,
      },
      sources: {
        release: 'HotWheelsHub (scraped)',
        details: 'Needs manual verification',
      },
      lastUpdated: new Date().toISOString().split('T')[0],
      _needsReview: true,
    }));

    writeFileSync(OUTPUT_PATH, JSON.stringify(newCarsData, null, 2));
    console.log(`\n💾  Saved new cars to: ${OUTPUT_PATH}`);
    console.log('   Review the file, then merge into public/data/cars.json manually.');
  } else {
    console.log('✨  No new cars found. Your database is up to date!');
  }

  console.log('\n🏁  Scrape complete.');
}

main().catch((err) => {
  console.error('❌  Scraper failed:', err.message);
  process.exit(1);
});
