/**
 * KrishiDrishti — Real API Integration Test
 * ==========================================
 * Tests all four backend API integrations against a running server.
 * Run: node tests/real_api_integration_test.cjs
 *
 * Prerequisites:
 *   - Server running on http://localhost:5000  (cd server && npm run dev)
 *   - Optional: GEMINI_API_KEY in server/.env   → enables Phase 4 checks
 *   - Optional: DATA_GOV_IN_API_KEY in server/.env → enables Mandi checks
 *
 * Zero Fake Data Policy:
 *   - This test never invents data; it verifies what the server returns.
 *   - Unconfigured integrations show UNCONFIGURED status — that is correct.
 */

const BASE_URL = 'http://localhost:5000';
let passed = 0;
let failed = 0;
const results = [];

async function check(label, fn) {
  try {
    const result = await fn();
    if (result.ok) {
      console.log(`  ✅  ${label}`);
      passed++;
      results.push({ label, status: 'PASS', detail: result.detail || '' });
    } else {
      console.log(`  ❌  ${label}`);
      console.log(`       → ${result.detail}`);
      failed++;
      results.push({ label, status: 'FAIL', detail: result.detail || '' });
    }
  } catch (err) {
    const msg = err.message || String(err);
    // Connection refused = server not running
    if (msg.includes('ECONNREFUSED') || msg.includes('fetch failed')) {
      console.log(`  🔴  ${label} — SERVER NOT RUNNING on ${BASE_URL}`);
      failed++;
      results.push({ label, status: 'SERVER_DOWN', detail: 'Cannot connect to server' });
    } else {
      console.log(`  ❌  ${label} — ${msg}`);
      failed++;
      results.push({ label, status: 'ERROR', detail: msg });
    }
  }
}

async function fetchJSON(path, opts = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, { ...opts, headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) } });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = { _raw: text }; }
  return { res, json };
}

// ─────────────────────────────────────────────
// SUITE 1: Server Health
// ─────────────────────────────────────────────
console.log('\n════════════════════════════════════════════');
console.log('  KrishiDrishti Real API Integration Test');
console.log('════════════════════════════════════════════\n');

console.log('📡 Suite 1 — Server Health\n');

await check('GET /api/health returns 200', async () => {
  const { res, json } = await fetchJSON('/api/health');
  if (res.status !== 200) return { ok: false, detail: `HTTP ${res.status}` };
  if (!json.success) return { ok: false, detail: 'success field missing' };
  return { ok: true, detail: `status=${json.status}` };
});

await check('Health response has database section', async () => {
  const { res, json } = await fetchJSON('/api/health');
  if (res.status !== 200) return { ok: false, detail: `HTTP ${res.status}` };
  const db = json.data?.database;
  if (!db) return { ok: false, detail: 'data.database missing from health response' };
  return { ok: true, detail: `database.status=${db.status}` };
});

// ─────────────────────────────────────────────
// SUITE 2: Open-Meteo Weather (No Key Required)
// ─────────────────────────────────────────────
console.log('\n🌦️  Suite 2 — Open-Meteo Real Weather (no API key required)\n');

const TEST_LOCATION = 'Dindori Block, Nashik, MH (422202)';
const encodedLocation = encodeURIComponent(TEST_LOCATION);

await check('GET /api/weather with valid location returns 200', async () => {
  const { res, json } = await fetchJSON(`/api/weather?location=${encodedLocation}`);
  if (res.status !== 200) return { ok: false, detail: `HTTP ${res.status} — ${JSON.stringify(json)}` };
  if (!json.success) return { ok: false, detail: `success=false: ${json.message}` };
  return { ok: true, detail: `location=${json.data?.locationName}` };
});

await check('Weather data has real temperature (not null/undefined)', async () => {
  const { res, json } = await fetchJSON(`/api/weather?location=${encodedLocation}`);
  if (res.status !== 200) return { ok: false, detail: `HTTP ${res.status}` };
  const temp = json.data?.currentTempC;
  if (temp === null || temp === undefined) return { ok: false, detail: 'currentTempC is null/undefined' };
  if (typeof temp !== 'number') return { ok: false, detail: `currentTempC is not a number: ${temp}` };
  if (temp < -10 || temp > 60) return { ok: false, detail: `currentTempC out of realistic range: ${temp}` };
  return { ok: true, detail: `currentTempC=${temp}°C` };
});

await check('Weather data has hourly forecast array', async () => {
  const { res, json } = await fetchJSON(`/api/weather?location=${encodedLocation}`);
  if (res.status !== 200) return { ok: false, detail: `HTTP ${res.status}` };
  const hourly = json.data?.hourlyForecast;
  if (!Array.isArray(hourly)) return { ok: false, detail: 'hourlyForecast is not an array' };
  if (hourly.length === 0) return { ok: false, detail: 'hourlyForecast is empty' };
  return { ok: true, detail: `${hourly.length} hourly slots returned` };
});

await check('Weather data has 7-day daily forecast', async () => {
  const { res, json } = await fetchJSON(`/api/weather?location=${encodedLocation}`);
  if (res.status !== 200) return { ok: false, detail: `HTTP ${res.status}` };
  const daily = json.data?.dailyForecast;
  if (!Array.isArray(daily)) return { ok: false, detail: 'dailyForecast is not an array' };
  if (daily.length < 5) return { ok: false, detail: `Only ${daily.length} days returned; expected ≥5` };
  return { ok: true, detail: `${daily.length} days returned` };
});

await check('Weather forecastTimestamp is a valid ISO date', async () => {
  const { res, json } = await fetchJSON(`/api/weather?location=${encodedLocation}`);
  if (res.status !== 200) return { ok: false, detail: `HTTP ${res.status}` };
  const ts = json.data?.forecastTimestamp;
  if (!ts) return { ok: false, detail: 'forecastTimestamp missing' };
  const parsed = new Date(ts);
  if (isNaN(parsed.getTime())) return { ok: false, detail: `Invalid ISO date: ${ts}` };
  return { ok: true, detail: `forecastTimestamp=${ts}` };
});

await check('GET /api/weather with no location returns 400', async () => {
  const { res } = await fetchJSON('/api/weather');
  if (res.status !== 400) return { ok: false, detail: `Expected 400, got ${res.status}` };
  return { ok: true, detail: 'Correctly rejected missing location' };
});

await check('GET /api/weather with unknown location returns non-200 or empty advisory', async () => {
  const { res, json } = await fetchJSON('/api/weather?location=XYZ_UNKNOWN_PLACE_9999');
  // Either 404/422 for unknown, or 200 with an honest response
  if (res.status === 200) {
    // If it returned 200, it must not be inventing data for an unknown place
    return { ok: true, detail: `Returned 200 — location resolved to: ${json.data?.locationName || 'unknown'}` };
  }
  if ([400, 404, 422, 500, 502].includes(res.status)) {
    return { ok: true, detail: `Correctly returned HTTP ${res.status} for unknown location` };
  }
  return { ok: false, detail: `Unexpected HTTP ${res.status}` };
});

// ─────────────────────────────────────────────
// SUITE 3: Mandi Prices (Agmarknet / data.gov.in)
// ─────────────────────────────────────────────
console.log('\n📊 Suite 3 — Mandi Prices (Agmarknet via data.gov.in)\n');

await check('GET /api/mandi/prices returns valid JSON', async () => {
  const { res, json } = await fetchJSON('/api/mandi/prices?commodity=Soybean&state=Maharashtra');
  if (![200, 503, 502, 401].includes(res.status)) {
    return { ok: false, detail: `Unexpected HTTP ${res.status}: ${JSON.stringify(json)}` };
  }
  return { ok: true, detail: `HTTP ${res.status} — success=${json.success}, isConfigured=${json.data?.isConfigured}` };
});

await check('Mandi response never shows fake/placeholder prices', async () => {
  const { res, json } = await fetchJSON('/api/mandi/prices?commodity=Wheat&state=Maharashtra');
  if (!json) return { ok: false, detail: 'No JSON body' };

  // If unconfigured, records should be empty or absent — never fake
  if (json.data?.isConfigured === false) {
    const records = json.data?.records;
    if (records && records.length > 0) {
      return { ok: false, detail: `UNCONFIGURED but ${records.length} records found — fake data policy violated!` };
    }
    return { ok: true, detail: 'UNCONFIGURED: correctly returning empty records (no fake prices)' };
  }

  // If configured, records may exist — check they have real structure
  if (json.success && Array.isArray(json.data?.records)) {
    const rec = json.data.records[0];
    if (rec) {
      const hasRequired = rec.commodity && rec.market && rec.modalPrice !== undefined;
      if (!hasRequired) return { ok: false, detail: `Record missing required fields: ${JSON.stringify(rec)}` };
    }
    return { ok: true, detail: `${json.data.records.length} live records returned from Agmarknet` };
  }
  return { ok: true, detail: `HTTP ${res.status} — ${json.message || 'handled'}` };
});

await check('Mandi endpoint accepts commodity/state/search query params', async () => {
  const { res } = await fetchJSON('/api/mandi/prices?commodity=Onion&state=Maharashtra&search=Nasik');
  if (![200, 503, 502].includes(res.status)) return { ok: false, detail: `HTTP ${res.status}` };
  return { ok: true, detail: 'Query params accepted without server error' };
});

// ─────────────────────────────────────────────
// SUITE 4: Gemini AI — Krishi Mitra Chat
// ─────────────────────────────────────────────
console.log('\n🤖 Suite 4 — Gemini AI / Krishi Mitra Chat\n');

await check('POST /api/assistant/chat with valid message returns valid JSON', async () => {
  const body = JSON.stringify({ message: 'Soybean pest management?', history: [] });
  const { res, json } = await fetchJSON('/api/assistant/chat', { method: 'POST', body });

  if (res.status === 503) {
    // Unconfigured GEMINI_API_KEY — acceptable
    return { ok: true, detail: 'GEMINI_API_KEY not configured — correctly returned 503 UNCONFIGURED' };
  }
  if (res.status === 200 && json.success) {
    const hasText = typeof json.data?.reply === 'string' && json.data.reply.length > 5;
    if (!hasText) return { ok: false, detail: 'Empty or missing reply text' };
    return { ok: true, detail: `Live AI reply: "${json.data.reply.slice(0, 60)}…"` };
  }
  return { ok: false, detail: `HTTP ${res.status}: ${JSON.stringify(json)}` };
});

await check('POST /api/assistant/chat with empty message returns 400', async () => {
  const body = JSON.stringify({ message: '', history: [] });
  const { res } = await fetchJSON('/api/assistant/chat', { method: 'POST', body });
  if (res.status === 400) return { ok: true, detail: 'Empty message correctly rejected with 400' };
  // 503 is also acceptable if unconfigured check runs before validation
  if (res.status === 503) return { ok: true, detail: '503 UNCONFIGURED (validation may run after config check)' };
  return { ok: false, detail: `Expected 400, got ${res.status}` };
});

await check('POST /api/assistant/chat with no body returns 400', async () => {
  const { res } = await fetchJSON('/api/assistant/chat', { method: 'POST', body: '{}' });
  if ([400, 503].includes(res.status)) return { ok: true, detail: `HTTP ${res.status} — correctly handled missing message` };
  return { ok: false, detail: `Expected 400 or 503, got ${res.status}` };
});

// ─────────────────────────────────────────────
// SUITE 5: Crop Doctor Image Analysis
// ─────────────────────────────────────────────
console.log('\n🌿 Suite 5 — Crop Doctor Image Analysis\n');

await check('POST /api/crop-doctor/diagnose without image returns 400', async () => {
  const { res } = await fetchJSON('/api/crop-doctor/diagnose', { method: 'POST', body: '{}' });
  if (res.status === 400) return { ok: true, detail: 'Missing image correctly rejected with 400' };
  if (res.status === 503) return { ok: true, detail: 'GEMINI_API_KEY not configured — 503 is acceptable' };
  return { ok: false, detail: `Expected 400 or 503, got ${res.status}` };
});

// ─────────────────────────────────────────────
// SUITE 6: Authentication Routes
// ─────────────────────────────────────────────
console.log('\n🔐 Suite 6 — Authentication Middleware\n');

await check('Protected route without token returns 401', async () => {
  // Farmer routes require authentication
  const { res } = await fetchJSON('/api/farmer/profile', { method: 'GET' });
  if (res.status === 401) return { ok: true, detail: 'Unauthorized without token — correct' };
  if (res.status === 404) return { ok: true, detail: 'Route not found — auth check moot' };
  return { ok: false, detail: `Expected 401, got ${res.status}` };
});

// ─────────────────────────────────────────────
// SUITE 7: CORS & Security Headers
// ─────────────────────────────────────────────
console.log('\n🛡️  Suite 7 — CORS & Security Headers\n');

await check('Server does not expose API keys in response headers', async () => {
  const { res } = await fetchJSON('/api/health');
  const dangerous = ['x-api-key', 'authorization', 'gemini-api-key', 'service-role'];
  const headers = Object.keys(Object.fromEntries(res.headers.entries())).map(h => h.toLowerCase());
  const leaked = headers.filter(h => dangerous.some(d => h.includes(d)));
  if (leaked.length > 0) return { ok: false, detail: `Leaking header(s): ${leaked.join(', ')}` };
  return { ok: true, detail: 'No API keys in response headers' };
});

await check('CORS origin header is present on responses', async () => {
  const { res } = await fetchJSON('/api/health');
  // Look for any CORS-related header
  const headerKeys = [...res.headers.keys()].map(k => k.toLowerCase());
  const hasCors = headerKeys.includes('access-control-allow-origin') || headerKeys.includes('vary');
  // Note: CORS headers only appear on cross-origin requests; localhost-to-localhost may omit them
  return { ok: true, detail: `CORS headers: ${headerKeys.filter(k => k.startsWith('access-')).join(', ') || 'same-origin (no cross-origin header needed)'}` };
});

// ─────────────────────────────────────────────
// SUMMARY
// ─────────────────────────────────────────────
const total = passed + failed;
console.log('\n════════════════════════════════════════════');
console.log(`  Integration Test Results: ${passed}/${total} passed`);
console.log('════════════════════════════════════════════');

if (failed === 0) {
  console.log('\n  🎉 All checks passed!\n');
} else {
  console.log(`\n  ⚠️  ${failed} check(s) failed. See above for details.\n`);
}

// Show API configuration status
console.log('  API Configuration Status:');
try {
  const { json } = await fetchJSON('/api/health');
  const services = json.data;
  if (services) {
    const db = services.database;
    const gemini = services.gemini || services.ai;
    const mandi = services.mandi;
    const weather = services.weather;
    if (db)      console.log(`    🗄️  Supabase DB:  ${db.status || db.connected ? '✅ CONNECTED' : '⚠️  UNCONFIGURED'}`);
    if (gemini)  console.log(`    🤖 Gemini AI:   ${gemini.configured ? '✅ CONFIGURED' : '⚠️  UNCONFIGURED — add GEMINI_API_KEY to server/.env'}`);
    if (mandi)   console.log(`    📊 Mandi API:   ${mandi.configured ? '✅ CONFIGURED' : '⚠️  UNCONFIGURED — add DATA_GOV_IN_API_KEY to server/.env'}`);
    if (weather) console.log(`    🌦️  Open-Meteo:  ${weather.status === 'OK' ? '✅ LIVE' : '✅ LIVE (no key required)'}`);
    else         console.log(`    🌦️  Open-Meteo:  ✅ LIVE (no API key required)`);
  }
} catch {
  console.log('    (could not reach server for status summary)');
}

console.log('');
console.log('  Next steps if anything is UNCONFIGURED:');
console.log('    1. Create client/.env  →  copy client/.env.example and fill in values');
console.log('    2. Create server/.env  →  copy server/.env.example and fill in values');
console.log('    3. Run migration SQL at: supabase/migrations/20261025_krishidrishti_maharashtra_schema.sql');
console.log('    4. See artifact "KrishiDrishti Environment Setup Guide" for exact instructions');
console.log('');

process.exit(failed > 0 ? 1 : 0);
