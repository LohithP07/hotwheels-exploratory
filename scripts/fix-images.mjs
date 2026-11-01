/**
 * Fix Wrong Images
 * ===============
 * Fixes cars that got wrong Wikimedia images (Case waves, original HW castings,
 * fictional characters, monster trucks) by setting their images to null.
 * Also lists cars that need manual image review.
 *
 * Usage: node scripts/fix-images.mjs
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const CARS_JSON_PATH = join(process.cwd(), 'public', 'data', 'cars.json');

/**
 * Car IDs that should NOT have real-car images
 * (Original HW castings, fictional characters, monster trucks, case waves)
 */
const NO_REAL_CAR_IDS = new Set([
  // Original Hot Wheels castings (no real car equivalent)
  'twin-mill',
  'bone-shaker',
  'redline-twin-mill',
  'redline-bone-shaker',
  // Case waves (not specific cars)
  '2027-mainline-case-a-1',
  '2027-mainline-case-b',
  '2027-mainline-case-c',
  '2027-mainline-case-d',
  '2026-mainline-case-o',
  // Treasure Hunt variants of original castings
  '2026-super-treasure-hunt-1',
  '2026-holiday-special',
  '2026-treasure-hunt-2',
  // Fictional characters
  'marvel-2026-spider-man',
  'marvel-2027-spider-man',
  'star-wars-2026-millennium-falcon',
  'star-wars-2026-x-wing',
  'star-wars-2027-millennium-falcon',
  // Monster trucks (not real cars)
  'hw-monster-jam-2026-grave-digger',
  'hw-monster-jam-2027-el-toro-loco',
  'monster-jam-2027-grave-digger',
]);

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
  console.log('🔧 HotWheels Image Fixer');
  console.log('========================\n');

  const cars = loadCars();
  console.log(`📦  Loaded ${cars.length} cars\n`);

  let fixedCount = 0;
  let needsReview = [];

  for (const car of cars) {
    const hasDiecast = Boolean(car.images.diecast);
    const hasRealCar = Boolean(car.images.realCar);

    // Case 1: Car is in NO_REAL_CAR_IDS but has an image — remove it
    if (NO_REAL_CAR_IDS.has(car.id) && (hasDiecast || hasRealCar)) {
      console.log(`   🗑️  Removing wrong image from: ${car.name}`);
      car.images.diecast = null;
      car.images.realCar = null;
      car.images.fallbackUsed = true;
      fixedCount++;
    }

    // Case 2: Car has no images at all — needs manual review
    if (!hasDiecast && !hasRealCar) {
      needsReview.push(car);
    }
  }

  // Save updated cars.json
  writeFileSync(CARS_JSON_PATH, JSON.stringify(cars, null, 2));

  console.log(`\n✅  Fixed ${fixedCount} cars with wrong images`);
  console.log(`⚠️  Cars needing manual image review: ${needsReview.length}`);

  if (needsReview.length > 0) {
    console.log('\n📋  Cars needing manual images:');
    for (const car of needsReview) {
      console.log(`   • ${car.name} (${car.series || 'Unknown series'})`);
    }
    console.log('\n   Add Wikimedia Commons image URLs to images.realCar in cars.json');
    console.log('   Or leave as null for placeholder display.');
  }

  // Count cars with images
  const withImages = cars.filter(c => c.images.diecast || c.images.realCar).length;
  const withoutImages = cars.length - withImages;

  console.log(`\n📊  Summary:`);
  console.log(`   Total cars: ${cars.length}`);
  console.log(`   With images: ${withImages}`);
  console.log(`   Without images: ${withoutImages}`);
  console.log(`💾  Saved: ${CARS_JSON_PATH}`);
}

main().catch((err) => {
  console.error('❌  Script failed:', err.message);
  process.exit(1);
});
