const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('====================================================');
console.log('🌐 KRISHIDRISHTI — SITE-WIDE TRANSLATION AUDIT');
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

// 1. Audit translations.ts file and dictionary completeness
console.log('1. Auditing Translation Dictionaries (EN, HI, MR)...');

const translationsPath = path.join(__dirname, '../client/src/i18n/translations.ts');
test('translations.ts exists in client/src/i18n', () => {
  assert(fs.existsSync(translationsPath), 'translations.ts not found');
});

const translationsContent = fs.readFileSync(translationsPath, 'utf8');

// Parse translations dictionary
let translationsObj;
try {
  // Convert TS export to commonjs evaluation
  const cleaned = translationsContent
    .replace(/export\s+type\s+Language\s*=\s*'en'\s*\|\s*'hi'\s*\|\s*'mr';/, '')
    .replace(/export\s+const\s+translations:\s*Record<Language,\s*Record<string,\s*string>>\s*=/, 'module.exports =');
  const tempFile = path.join(__dirname, 'temp_translations.cjs');
  fs.writeFileSync(tempFile, cleaned);
  translationsObj = require(tempFile);
  fs.unlinkSync(tempFile);
} catch (e) {
  throw new Error(`Failed to parse translations.ts: ${e.message}`);
}

test('Supports all three required languages: en, hi, mr', () => {
  assert(translationsObj.en, 'Missing en translations');
  assert(translationsObj.hi, 'Missing hi translations');
  assert(translationsObj.mr, 'Missing mr translations');
});

const enKeys = Object.keys(translationsObj.en);
const hiKeys = Object.keys(translationsObj.hi);
const mrKeys = Object.keys(translationsObj.mr);

test(`Dictionary is comprehensive (${enKeys.length} keys defined)`, () => {
  assert(enKeys.length >= 100, `Expected at least 100 translation keys, found ${enKeys.length}`);
});

test('All English keys have corresponding Hindi translations', () => {
  const missingInHi = enKeys.filter(k => !(k in translationsObj.hi));
  assert.strictEqual(missingInHi.length, 0, `Missing Hindi keys: ${missingInHi.join(', ')}`);
});

test('All English keys have corresponding Marathi translations', () => {
  const missingInMr = enKeys.filter(k => !(k in translationsObj.mr));
  assert.strictEqual(missingInMr.length, 0, `Missing Marathi keys: ${missingInMr.join(', ')}`);
});

test('Zero empty string translations across all languages', () => {
  for (const lang of ['en', 'hi', 'mr']) {
    for (const [k, v] of Object.entries(translationsObj[lang])) {
      assert(typeof v === 'string' && v.trim().length > 0, `Empty translation for [${lang}][${k}]`);
    }
  }
});

test('Marathi and Hindi translations contain genuine Devanagari script', () => {
  const devanagariRegex = /[\u0900-\u097F]/;
  const hiDevanagariCount = hiKeys.filter(k => devanagariRegex.test(translationsObj.hi[k])).length;
  const mrDevanagariCount = mrKeys.filter(k => devanagariRegex.test(translationsObj.mr[k])).length;
  assert(hiDevanagariCount > hiKeys.length * 0.8, `Expected >80% Hindi keys to have Devanagari text, got ${hiDevanagariCount}/${hiKeys.length}`);
  assert(mrDevanagariCount > mrKeys.length * 0.8, `Expected >80% Marathi keys to have Devanagari text, got ${mrDevanagariCount}/${mrKeys.length}`);
});

// 2. Audit component integration with useLanguage & t(...)
console.log('\n2. Auditing Component Integration with Translation System...');

const clientSrc = path.join(__dirname, '../client/src');
const filesToAudit = [
  'components/Navbar.tsx',
  'components/Footer.tsx',
  'components/KisanHelplineBar.tsx',
  'components/HonestEmptyState.tsx',
  'pages/Home.tsx',
  'pages/Dashboard.tsx',
  'pages/CropDoctor.tsx',
  'pages/Assistant.tsx',
  'pages/WeatherAdvisory.tsx',
  'pages/MandiPrices.tsx',
  'pages/CropRecommendation.tsx',
  'pages/FarmPlanning.tsx',
  'pages/Auth.tsx'
];

for (const relPath of filesToAudit) {
  const fullPath = path.join(clientSrc, relPath);
  test(`File "${relPath}" imports and uses useLanguage`, () => {
    assert(fs.existsSync(fullPath), `File ${relPath} not found`);
    const content = fs.readFileSync(fullPath, 'utf8');
    assert(content.includes('useLanguage'), `File ${relPath} does not import useLanguage`);
    assert(content.includes("t('") || content.includes('t("'), `File ${relPath} does not invoke t(...) for translations`);
  });
}

// 3. Test dynamic parameter interpolation in LanguageContext
console.log('\n3. Testing Dynamic Parameter Interpolation in t(key, params)...');

const interpolate = (template, params) => {
  let text = template;
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    });
  }
  return text;
};

test('Interpolates single parameter {count} correctly in all languages', () => {
  const enRes = interpolate(translationsObj.en.plotsTracked, { count: 3 });
  const hiRes = interpolate(translationsObj.hi.plotsTracked, { count: 3 });
  const mrRes = interpolate(translationsObj.mr.plotsTracked, { count: 3 });
  assert.strictEqual(enRes, '3 Plots Tracked');
  assert.strictEqual(hiRes, '3 प्लॉट ट्रैक किए गए');
  assert.strictEqual(mrRes, '3 प्लॉट निरीक्षण चालू');
});

test('Interpolates multiple parameters {district} and {season} correctly', () => {
  const enRes = interpolate(translationsObj.en.optimalCandidates, { district: 'Nashik', season: 'Kharif' });
  const hiRes = interpolate(translationsObj.hi.optimalCandidates, { district: 'Nashik', season: 'Kharif' });
  const mrRes = interpolate(translationsObj.mr.optimalCandidates, { district: 'Nashik', season: 'Kharif' });
  assert.strictEqual(enRes, 'Optimal Crop Candidates for Nashik (Kharif Season)');
  assert.strictEqual(hiRes, 'Nashik (Kharif मौसम) के लिए उपयुक्त फसलें');
  assert.strictEqual(mrRes, 'Nashik (Kharif हंगाम) साठी योग्य पिके');
});

console.log('\n====================================================');
console.log(`Audit Complete: ${passed} Passed, ${failed} Failed.`);
console.log('====================================================');

if (failed > 0) {
  process.exit(1);
}
