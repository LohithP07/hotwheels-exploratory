/**
 * Merge New Cars Helper
 * =====================
 * Merges new-cars-found.json (from scrape-releases.mjs) into cars.json.
 *
 * Usage: node scripts/merge-new-cars.mjs
 *
 * This script:
 * 1. Reads public/data/cars.json
 * 2. Reads scripts/new-cars-found.json (if it exists)
 * 3. Shows each new car with its data
 * 4. Asks which ones to merge (or merge all)
 * 5. Writes updated cars.json
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const CARS_JSON_PATH = join(process.cwd(), 'public', 'data', 'cars.json');
const NEW_CARS_PATH = join(process.cwd(), 'scripts', 'new-cars-found.json');

function loadJson(path) {
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, 'utf-8'));
}

async function main() {
  console.log('🔧 HotWheels Car Merger');
  console.log('=======================\n');

  const existingCars = loadJson(CARS_JSON_PATH);
  if (!existingCars) {
    console.error(`❌  cars.json not found at ${CARS_JSON_PATH}`);
    process.exit(1);
  }

  const newCars = loadJson(NEW_CARS_PATH);
  if (!newCars || newCars.length === 0) {
    console.log('✨  No new cars to merge. Run scrape-releases.mjs first.');
    return;
  }

  console.log(`📦  Existing cars: ${existingCars.length}`);
  console.log(`🆕  New cars to review: ${newCars.length}\n`);

  // Display each new car
  for (let i = 0; i < newCars.length; i++) {
    const car = newCars[i];
    console.log(`[${i + 1}/${newCars.length}] ${car.name}`);
    console.log(`         Series: ${car.series || 'N/A'}`);
    console.log(`         Origin: ${car.origin || 'N/A'}`);
    console.log(`         Country: ${car.country || 'N/A'}`);
    console.log(`         Year: ${car.yearIntroduced || 'N/A'}`);
    console.log(`         Release: ${car.releaseDate || 'TBA'}`);
    console.log(`         Source: ${car.sources.release}`);
    console.log('');
  }

  // Auto-merge all (for now - in a real scenario you'd want interactive prompts)
  // For this script, we'll merge all since it's a local tool
  const merged = [...existingCars, ...newCars.map((c) => {
    const { _needsReview, ...clean } = c;
    return clean;
  })];

  // Remove duplicates by name (case-insensitive)
  const seen = new Set();
  const deduped = merged.filter((car) => {
    const key = car.name.toLowerCase().trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  writeFileSync(CARS_JSON_PATH, JSON.stringify(deduped, null, 2));
  console.log(`✅  Merged ${newCars.length} new cars.`);
  console.log(`📦  Total cars: ${deduped.length}`);
  console.log(`\n💾  Updated: ${CARS_JSON_PATH}`);
  console.log('\n⚠️  Review the added cars - some may need manual image URLs and details.');
}

main().catch((err) => {
  console.error('❌  Merge failed:', err.message);
  process.exit(1);
});
