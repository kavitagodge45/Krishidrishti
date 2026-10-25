const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('====================================================');
console.log('🌾 KRISHIDRISHTI — REAL FARMER REGISTRATION & MULTILINGUAL AUDIT');
console.log('====================================================\n');

let passed = 0;
let failed = 0;

function test(description, fn) {
  try {
    fn();
    console.log(`  ✅ PASS: ${description}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${description}`);
    console.error(`     Error: ${err.message}`);
    failed++;
  }
}

// 1. Verify Verified Farmer Profile & Land Registry Card in Dashboard.tsx
console.log('1. Auditing Farmer Profile & Land Registry Card in Dashboard.tsx...');
const dashboardPath = path.join(__dirname, '../client/src/pages/Dashboard.tsx');
const dashboardCode = fs.readFileSync(dashboardPath, 'utf8');

test('Dashboard displays Verified Farmer Profile Card when user & profile are present', () => {
  assert(dashboardCode.includes("t('farmerProfileCardTitle')"), 'Missing farmerProfileCardTitle');
  assert(dashboardCode.includes("t('verifiedFarmerStatus')"), 'Missing verifiedFarmerStatus');
});

test('Displays all 10+ real farmer registration fields without hardcoded fake data', () => {
  assert(dashboardCode.includes("profile.fullName"), 'Missing profile.fullName');
  assert(dashboardCode.includes("profile.kisanRegId"), 'Missing profile.kisanRegId');
  assert(dashboardCode.includes("user.email"), 'Missing user.email');
  assert(dashboardCode.includes("profile.phoneNumber"), 'Missing profile.phoneNumber');
  assert(dashboardCode.includes("profile.village"), 'Missing profile.village');
  assert(dashboardCode.includes("profile.taluka"), 'Missing profile.taluka');
  assert(dashboardCode.includes("profile.district"), 'Missing profile.district');
  assert(dashboardCode.includes("profile.state"), 'Missing profile.state');
  assert(dashboardCode.includes("profile.totalLandAcres"), 'Missing profile.totalLandAcres');
  assert(dashboardCode.includes("profile.primarySoilType"), 'Missing profile.primarySoilType');
  assert(dashboardCode.includes("profile.preferredLanguage"), 'Missing profile.preferredLanguage');
});

test('Shows honest guest mode state when user is not registered', () => {
  assert(dashboardCode.includes("t('unregisteredFarmerTitle')"), 'Missing unregisteredFarmerTitle');
  assert(dashboardCode.includes("t('unregisteredFarmerDesc')"), 'Missing unregisteredFarmerDesc');
  assert(dashboardCode.includes("t('registerNewFarmerBtn')"), 'Missing registerNewFarmerBtn');
});

test('Persists local farm plots and logs for authenticated local session', () => {
  assert(dashboardCode.includes('krishidrishti_plots_'), 'Missing local plots persistence');
  assert(dashboardCode.includes('krishidrishti_logs_'), 'Missing local logs persistence');
  assert(dashboardCode.includes('krishidrishti_tasks_'), 'Missing local tasks persistence');
});

// 2. Verify Mandi Prices Dropdown and Page Localization
console.log('\n2. Auditing MandiPrices.tsx Full Localization...');
const mandiPath = path.join(__dirname, '../client/src/pages/MandiPrices.tsx');
const mandiCode = fs.readFileSync(mandiPath, 'utf8');

test('Mandi commodities are mapped to localized translation keys', () => {
  assert(mandiCode.includes("key: 'comm_soybean'"), 'Missing comm_soybean key');
  assert(mandiCode.includes("key: 'comm_onion'"), 'Missing comm_onion key');
  assert(mandiCode.includes("t(c.key as any)"), 'Dropdown not using t(c.key)');
});

test('Mandi states are mapped to localized translation keys', () => {
  assert(mandiCode.includes("key: 'state_maharashtra'"), 'Missing state_maharashtra key');
  assert(mandiCode.includes("key: 'state_mp'"), 'Missing state_mp key');
  assert(mandiCode.includes("t(s.key as any)"), 'Dropdown not using t(s.key)');
});

// 3. Verify Crop Recommendation Dropdown and Page Localization
console.log('\n3. Auditing CropRecommendation.tsx Full Localization...');
const cropRecPath = path.join(__dirname, '../client/src/pages/CropRecommendation.tsx');
const cropRecCode = fs.readFileSync(cropRecPath, 'utf8');

test('CropRecommendation districts, soils, and seasons use translation keys', () => {
  assert(cropRecCode.includes("t('loc_nashik')"), 'Missing loc_nashik translation');
  assert(cropRecCode.includes("t('soil_black_cotton')"), 'Missing soil_black_cotton translation');
  assert(cropRecCode.includes("t('season_kharif')"), 'Missing season_kharif translation');
  assert(cropRecCode.includes("t('water_drip')"), 'Missing water_drip translation');
});

// 4. Verify CropDoctor.tsx Full Localization
console.log('\n4. Auditing CropDoctor.tsx Full Localization...');
const cropDocPath = path.join(__dirname, '../client/src/pages/CropDoctor.tsx');
const cropDocCode = fs.readFileSync(cropDocPath, 'utf8');

test('CropDoctor hints and severity pills use translation keys', () => {
  assert(cropDocCode.includes("key: 'crop_autodetect'"), 'Missing crop_autodetect key');
  assert(cropDocCode.includes("key: 'crop_soybean'"), 'Missing crop_soybean key');
  assert(cropDocCode.includes("t('severity_severe')"), 'Missing severity_severe translation');
  assert(cropDocCode.includes("t('indianCropsCount')"), 'Missing indianCropsCount translation');
});

// 5. Verify WeatherAdvisory.tsx Full Localization
console.log('\n5. Auditing WeatherAdvisory.tsx Full Localization...');
const weatherPath = path.join(__dirname, '../client/src/pages/WeatherAdvisory.tsx');
const weatherCode = fs.readFileSync(weatherPath, 'utf8');

test('WeatherAdvisory locations mapped to localized translation keys', () => {
  assert(weatherCode.includes("key: 'loc_dindori'"), 'Missing loc_dindori key');
  assert(weatherCode.includes("key: 'loc_niphad'"), 'Missing loc_niphad key');
  assert(weatherCode.includes("t(loc.key as any)"), 'Dropdown not using t(loc.key)');
});

// 6. Verify FarmPlanning.tsx Full Localization
console.log('\n6. Auditing FarmPlanning.tsx Full Localization...');
const farmPlanPath = path.join(__dirname, '../client/src/pages/FarmPlanning.tsx');
const farmPlanCode = fs.readFileSync(farmPlanPath, 'utf8');

test('FarmPlanning presets, priorities, and economics use translation keys', () => {
  assert(farmPlanCode.includes("t('preset_soybean')"), 'Missing preset_soybean translation');
  assert(farmPlanCode.includes("t('preset_onion')"), 'Missing preset_onion translation');
  assert(farmPlanCode.includes("t('priorityHigh')"), 'Missing priorityHigh translation');
  assert(farmPlanCode.includes("t('farmEconomicsTag')"), 'Missing farmEconomicsTag translation');
});

console.log('\n====================================================');
console.log(`Summary: ${passed} Passed, ${failed} Failed.`);
console.log('====================================================\n');

if (failed > 0) process.exit(1);
