/**
 * Add Type Field to Cars
 * ======================
 * Adds the `type` field to each car in cars.json based on manual assignment.
 *
 * Usage: node scripts/add-car-types.mjs
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const CARS_JSON_PATH = join(process.cwd(), 'public', 'data', 'cars.json');

// Manual type assignments for each car
const TYPE_ASSIGNMENTS = {
  // Original HW castings
  'twin-mill': 'Supercar',
  'bone-shaker': 'Muscle',
  'redline-twin-mill': 'Supercar',
  'redline-bone-shaker': 'Muscle',
  
  // Classic muscle
  '67-camaro': 'Muscle',
  '69-charger': 'Muscle',
  '55-chevy': 'Muscle',
  'redline-67-camaro': 'Muscle',
  
  // Sports cars
  'hw-50-nissan-skyline-gt-r-r34': 'Sports Car',
  'rlc-2026-nissan-gt-r': 'Sports Car',
  'car-culture-2026-nissan-silvia-s15': 'Coupe',
  'premium-2027-porsche-911-gt3-rs': 'Sports Car',
  'car-culture-2027-mazda-rx-7': 'Coupe',
  'car-culture-2026-toyota-supra': 'Sports Car',
  'silver-2026-nissan-skyline-r34': 'Sports Car',
  'silver-2027-toyota-supra-mk5': 'Sports Car',
  'gold-2026-porsche-911-gt3-rs': 'Sports Car',
  'car-culture-2027-nissan-silvia-s15': 'Coupe',
  
  // Supercars
  'rlc-2026-ferrari-f40': 'Supercar',
  'premium-2026-lamborghini-aventador': 'Supercar',
  'gold-2027-lamborghini-huracan': 'Supercar',
  'premium-2027-ford-gt': 'Supercar',
  'premium-2027-ferrari-f40': 'Supercar',
  '2026-super-treasure-hunt-1': 'Supercar',
  'redline-twin-mill': 'Supercar',
  '2026-holiday-special': 'Supercar',
  
  // Trucks
  'hw-monster-jam-2026-grave-digger': 'Truck',
  'hw-city-2027-tesla-cybertruck': 'Truck',
  'hw-monster-jam-2027-el-toro-loco': 'Truck',
  'monster-jam-2027-grave-digger': 'Truck',
  
  // Sedans
  'hw-city-2026-tesla-model-3': 'Sedan',
  
  // Case waves (various - Sports Car as default)
  '2027-mainline-case-a-1': 'Sports Car',
  '2027-mainline-case-b': 'Sports Car',
  '2027-mainline-case-c': 'Sports Car',
  '2027-mainline-case-d': 'Sports Car',
  '2026-mainline-case-o': 'Sports Car',
  
  // TH/STH variants
  '2026-treasure-hunt-1': 'Muscle',
  '2026-treasure-hunt-2': 'Muscle',
  '2027-super-treasure-hunt-1': 'Muscle',
  
  // Fast & Furious
  'fast-furious-2026-dom-dodge-charger': 'Muscle',
  'fast-furious-2026-brians-nissan-skyline': 'Sports Car',
  'fast-furious-2027-dominics-charger': 'Muscle',
  
  // Base/Mainline
  'base-2026-ford-mustang': 'Muscle',
  'base-2027-chevy-camaro': 'Muscle',
  'mainline-2027-chevrolet-camaro-zl1': 'Muscle',
};

function loadCars() {
  if (!existsSync(CARS_JSON_PATH)) {
    console.error(`❌  cars.json not found at ${CARS_JSON_PATH}`);
    process.exit(1);
  }
  const raw = readFileSync(CARS_JSON_PATH, 'utf-8');
  return JSON.parse(raw);
}

function main() {
  const cars = loadCars();
  console.log(`📦  Loaded ${cars.length} cars from cars.json\n`);

  let assignedCount = 0;
  let missingCount = 0;

  for (const car of cars) {
    const type = TYPE_ASSIGNMENTS[car.id];
    if (type) {
      car.type = type;
      assignedCount++;
    } else {
      console.log(`   ⚠️  No type assigned for: ${car.id} - ${car.name}`);
      car.type = 'Sports Car'; // default fallback
      missingCount++;
    }
  }

  writeFileSync(CARS_JSON_PATH, JSON.stringify(cars, null, 2));

  console.log(`\n✅  Assigned type to ${assignedCount} cars`);
  if (missingCount > 0) {
    console.log(`⚠️  Used default 'Sports Car' for ${missingCount} cars`);
  }
  console.log(`💾  Saved: ${CARS_JSON_PATH}`);
}

main().catch((err) => {
  console.error('❌  Script failed:', err.message);
  process.exit(1);
});
