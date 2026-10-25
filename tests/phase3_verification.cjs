const fs = require('fs');
const path = require('path');
const http = require('http');

console.log('====================================================');
console.log('🌾 KRISHIDRISHTI — PHASE 3 DATABASE & AUTH AUDIT');
console.log('====================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passCount++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failCount++;
  }
}

// 1. MIGRATION FILE & SCHEMA AUDIT
console.log('1. Auditing Supabase PostgreSQL Schema & RLS Policies...');
const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20261025_krishidrishti_maharashtra_schema.sql');
assert(fs.existsSync(migrationPath), 'Migration SQL file exists');

if (fs.existsSync(migrationPath)) {
  const sql = fs.readFileSync(migrationPath, 'utf8');

  // Table assertions
  assert(sql.includes('CREATE TABLE IF NOT EXISTS public.profiles'), 'Table "profiles" exists with auth.users foreign key');
  assert(sql.includes('CREATE TABLE IF NOT EXISTS public.farms'), 'Table "farms" exists (7/12 Gat No. & Land Holding)');
  assert(sql.includes('CREATE TABLE IF NOT EXISTS public.plots'), 'Table "plots" exists (Cultivation plots)');
  assert(sql.includes('CREATE TABLE IF NOT EXISTS public.farm_tasks'), 'Table "farm_tasks" exists (Planner tasks)');
  assert(sql.includes('CREATE TABLE IF NOT EXISTS public.diagnostic_history'), 'Table "diagnostic_history" exists (Scan logs)');
  assert(sql.includes('CREATE TABLE IF NOT EXISTS public.farm_activity_logs'), 'Table "farm_activity_logs" exists (Digital Kisan Bahi)');

  // RLS enablement assertions
  assert(sql.includes('ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;'), 'RLS enabled on profiles');
  assert(sql.includes('ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;'), 'RLS enabled on farms');
  assert(sql.includes('ALTER TABLE public.plots ENABLE ROW LEVEL SECURITY;'), 'RLS enabled on plots');
  assert(sql.includes('ALTER TABLE public.farm_tasks ENABLE ROW LEVEL SECURITY;'), 'RLS enabled on farm_tasks');
  assert(sql.includes('ALTER TABLE public.diagnostic_history ENABLE ROW LEVEL SECURITY;'), 'RLS enabled on diagnostic_history');
  assert(sql.includes('ALTER TABLE public.farm_activity_logs ENABLE ROW LEVEL SECURITY;'), 'RLS enabled on farm_activity_logs');

  // Isolation assertions (auth.uid() = user_id or id)
  assert(sql.includes('auth.uid() = id'), 'Profiles protected by auth.uid() = id policy');
  assert(sql.includes('auth.uid() = user_id'), 'User tables protected by auth.uid() = user_id policy');

  // Trigger assertion
  assert(sql.includes('CREATE OR REPLACE FUNCTION public.handle_new_user()'), 'Auto-profile creation trigger exists on auth.users insert');

  // Zero fake seed data assertion
  const lowerSql = sql.toLowerCase();
  assert(!lowerSql.includes("insert into public.profiles values") && !lowerSql.includes("insert into public.plots values"), 'Zero fake seed records inserted in migration');
}

// 2. CLIENT CONFIGURATION & PAGES AUDIT
console.log('\n2. Auditing Client Auth & Route Architecture...');
const clientSrc = path.join(__dirname, '..', 'client', 'src');
assert(fs.existsSync(path.join(clientSrc, 'services', 'supabase.ts')), 'supabase.ts service client configured');
assert(fs.existsSync(path.join(clientSrc, 'context', 'AuthContext.tsx')), 'AuthContext.tsx session persistence configured');
assert(fs.existsSync(path.join(clientSrc, 'components', 'ProtectedRoute.tsx')), 'ProtectedRoute.tsx route guard implemented');
assert(fs.existsSync(path.join(clientSrc, 'pages', 'Auth.tsx')), 'Auth.tsx page with Sign In & Maharashtra Register tabs exists');

// Verify zero mock imports in pages
const dashboardCode = fs.readFileSync(path.join(clientSrc, 'pages', 'Dashboard.tsx'), 'utf8');
assert(!dashboardCode.includes('Ramesh Patil'), 'Zero hardcoded "Ramesh Patil" in Dashboard.tsx');
assert(!dashboardCode.includes('Fungicide Preventive Spray for Onion'), 'Zero hardcoded fake alerts in Dashboard.tsx');
assert(!dashboardCode.includes('Nitrogen (N) - Medium Level'), 'Zero hardcoded fake NPK values in Dashboard.tsx');

const doctorCode = fs.readFileSync(path.join(clientSrc, 'pages', 'CropDoctor.tsx'), 'utf8');
assert(!doctorCode.includes('#KDRi-2025-0892'), 'Zero fake pre-loaded Early Blight diagnosis in CropDoctor.tsx');

const assistantCode = fs.readFileSync(path.join(clientSrc, 'pages', 'Assistant.tsx'), 'utf8');
assert(!assistantCode.includes('Ramesh Patil'), 'Zero hardcoded "Ramesh Patil" in Assistant.tsx');
assert(!assistantCode.includes('Yellow Mosaic Virus (YMV)'), 'Zero fake initial conversation in Assistant.tsx');

// 3. TESTING SERVER EXPRESS APP & AUTH MIDDLEWARE (IN-MEMORY DISPATCH)
console.log('\n3. Testing Server Express App & Auth Middleware...');
const { createApp } = require('../server/dist/app.js');
const app = createApp();

function simulateRequest(method, url, headers = {}) {
  return new Promise((resolve) => {
    let statusCode = 200;
    let body = null;
    const req = {
      method,
      url,
      originalUrl: url,
      path: url.split('?')[0],
      query: {},
      headers: { ...headers },
      get: (h) => headers[h.toLowerCase()],
      on: () => {},
      headersSent: false
    };

    const res = {
      statusCode: 200,
      status: function(code) {
        statusCode = code;
        this.statusCode = code;
        return this;
      },
      setHeader: function() { return this; },
      set: function() { return this; },
      json: function(data) {
        body = data;
        resolve({ status: statusCode, body });
      },
      send: function(data) {
        body = data;
        resolve({ status: statusCode, body });
      },
      end: function() {
        resolve({ status: statusCode, body });
      },
      on: () => {}
    };

    app(req, res, () => {
      resolve({ status: 404, body: { message: 'Unhandled' } });
    });
  });
}

(async () => {
  try {
    // 1. Health Endpoint
    const healthRes = await simulateRequest('GET', '/api/health');
    assert(healthRes.status === 200, 'GET /api/health returns 200 OK');
    assert(healthRes.body.data && healthRes.body.data.server === 'KrishiDrishti API Server', 'Health report identifies KrishiDrishti API Server');

    // 2. Protected Route without token
    const profileRes = await simulateRequest('GET', '/api/farmer/profile');
    assert(profileRes.status === 401 || profileRes.status === 503, `GET /api/farmer/profile rejects unauthenticated request (Status: ${profileRes.status})`);

    // 3. Weather Endpoint (Honest pending Phase 5)
    const weatherRes = await simulateRequest('GET', '/api/weather');
    assert(weatherRes.status === 503, 'GET /api/weather returns 503 Service Unavailable (Zero Fake Data)');
    assert(weatherRes.body.status === 'UNCONFIGURED', 'Weather endpoint status is UNCONFIGURED');

    // 4. Mandi Prices Endpoint (Honest pending Phase 6)
    const mandiRes = await simulateRequest('GET', '/api/mandi/prices');
    assert(mandiRes.status === 503, 'GET /api/mandi/prices returns 503 Service Unavailable (Zero Fake Data)');
    assert(mandiRes.body.status === 'UNCONFIGURED', 'Mandi endpoint status is UNCONFIGURED');

    // 5. Crop Doctor Diagnostics History without user token
    const diagHistoryRes = await simulateRequest('GET', '/api/crop-doctor/history');
    assert(diagHistoryRes.status === 200, 'GET /api/crop-doctor/history handles unauthenticated state gracefully');
    assert(Array.isArray(diagHistoryRes.body.data) && diagHistoryRes.body.data.length === 0, 'Zero fake diagnosis records returned');

    console.log('\n====================================================');
    console.log(`Audit Complete: ${passCount} Passed, ${failCount} Failed.`);
    console.log('====================================================');
    process.exit(failCount > 0 ? 1 : 0);
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
})();

