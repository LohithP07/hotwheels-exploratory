/**
 * Wikimedia Commons Image Fetcher
 * ================================
 * Automatically finds real-car images from Wikimedia Commons for Hot Wheels
 * castings that are missing both diecast and real-car images.
 *
 * No API key required — Wikimedia Commons API is free and open.
 *
 * Usage: node scripts/fetch-images.mjs
 *
 * What it does:
 * 1. Reads public/data/cars.json
 * 2. For cars with no diecast AND no realCar image, searches Wikimedia Commons
 * 3. Updates cars.json with found image URLs
 * 4. Reports summary of what was found vs. still missing
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const CARS_JSON_PATH = join(process.cwd(), 'public', 'data', 'cars.json');

const REQUEST_DELAY = 2000; // 2 seconds between requests to avoid rate limiting

/**
 * Sleep helper
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fetch JSON from Wikimedia Commons API
 */
async function fetchWikimedia(url) {
  try {
    const response = await fetch(url.toString(), {
      headers: {
        'User-Agent': 'Hotwheels-Exploratory/1.0 (educational project; contact: user@example.com)',
        Accept: 'application/json',
      },
    });

    if (response.status === 429) {
      console.log(`   ⏳  Rate limited, waiting 5 seconds...`);
      await sleep(5000);
      return await fetchWikimedia(url); // retry once
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error(`  ⚠️  Wikimedia API error: ${err.message}`);
    return null;
  }
}

/**
 * Search Wikimedia Commons for image files matching a term
 */
async function searchWikimediaImages(searchTerm) {
  const url = new URL('https://commons.wikimedia.org/w/api.php');
  url.searchParams.set('action', 'query');
  url.searchParams.set('format', 'json');
  url.searchParams.set('list', 'search');
  url.searchParams.set('srsearch', `filetype:bitmap "${searchTerm}"`);
  url.searchParams.set('srnamespace', '6'); // File namespace
  url.searchParams.set('srlimit', '3');

  const data = await fetchWikimedia(url);
  if (!data || !data.query || !data.query.search) return [];

  return data.query.search.map((item) => item.title); // e.g., "File:Nissan Skyline GT-R.jpg"
}

/**
 * Get direct image URL from a Wikimedia file name
 */
async function getImageUrl(fileName) {
  const url = new URL('https://commons.wikimedia.org/w/api.php');
  url.searchParams.set('action', 'query');
  url.searchParams.set('format', 'json');
  url.searchParams.set('prop', 'imageinfo');
  url.searchParams.set('iiprop', 'url');
  url.searchParams.set('titles', fileName);

  const data = await fetchWikimedia(url);
  if (!data || !data.query || !data.query.pages) return null;

  const pages = data.query.pages;
  const pageId = Object.keys(pages)[0];
  const page = pages[pageId];

  if (!page || !page.imageinfo || page.imageinfo.length === 0) return null;

  return page.imageinfo[0].url;
}

/**
 * Build search terms from car data
 */
function buildSearchTerms(car) {
  const terms = [];

  // Primary: casting name + year
  if (car.castingName && car.yearIntroduced) {
    terms.push(`${car.castingName} ${car.yearIntroduced}`);
  }

  // Secondary: origin + year
  if (car.origin && car.yearIntroduced) {
    terms.push(`${car.origin} ${car.yearIntroduced}`);
  }

  // Tertiary: just casting name
  if (car.castingName) {
    terms.push(car.castingName);
  }

  // Tertiary: just origin
  if (car.origin) {
    terms.push(car.origin);
  }

  return terms.filter(Boolean);
}

/**
 * Load cars.json
 */
function loadCars() {
  if (!existsSync(CARS_JSON_PATH)) {
    console.error(`❌  cars.json not found at ${CARS_JSON_PATH}`);
    process.exit(1);
  }

  const raw = readFileSync(CARS_JSON_PATH, 'utf-8');
  return JSON.parse(raw);
}

/**
 * Main script
 */
async function main() {
  console.log('🖼️  HotWheels Image Fetcher');
  console.log('===========================\n');

  const cars = loadCars();
  console.log(`📦  Loaded ${cars.length} cars from cars.json\n`);

  // Find cars missing both diecast and realCar images
  const missingImages = cars.filter(
    (c) => !c.images.diecast && !c.images.realCar,
  );

  console.log(`📷  Cars missing images: ${missingImages.length}\n`);

  if (missingImages.length === 0) {
    console.log('✨  All cars already have images!');
    return;
  }

  let foundCount = 0;
  let notFoundCount = 0;

  for (const car of missingImages) {
    const searchTerms = buildSearchTerms(car);
    let foundImage = null;

    console.log(`\n🔍  Searching: ${car.name}`);

    for (const term of searchTerms) {
      console.log(`   Searching: "${term}"...`);

      const fileNames = await searchWikimediaImages(term);

      if (fileNames.length > 0) {
        const fileName = fileNames[0];
        console.log(`   Found file: ${fileName}`);

        const imageUrl = await getImageUrl(fileName);

        if (imageUrl) {
          foundImage = imageUrl;
          console.log(`   ✅  Got URL`);
          break;
        }
      }

      await sleep(REQUEST_DELAY);
    }

    if (foundImage) {
      car.images.realCar = foundImage;
      car.images.fallbackUsed = true;
      foundCount++;
      console.log(`   ✅  Image assigned to ${car.name}`);
    } else {
      console.log(`   ❌  No image found for ${car.name}`);
      notFoundCount++;
    }

    await sleep(REQUEST_DELAY);
  }

  // Save updated cars.json
  writeFileSync(CARS_JSON_PATH, JSON.stringify(cars, null, 2));

  console.log('\n' + '='.repeat(50));
  console.log(`✅  Found images for: ${foundCount} cars`);
  console.log(`❌  Still missing images: ${notFoundCount} cars`);
  console.log(`📦  Total cars: ${cars.length}`);
  console.log(`💾  Updated: ${CARS_JSON_PATH}`);
  console.log('\n🏁  Done!');
}

main().catch((err) => {
  console.error('❌  Script failed:', err.message);
  process.exit(1);
});
