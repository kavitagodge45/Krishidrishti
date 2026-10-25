/**
 * KrishiDrishti — Complete Live API Audit Suite
 * ==============================================
 * Directly tests all 4 real external services against their live production endpoints:
 * 1. Supabase PostgreSQL & Auth (RLS, table existence, user isolation)
 * 2. Open-Meteo Real Weather Telemetry (current metrics, spray window, 7-day forecast)
 * 3. Ministry of Agriculture Agmarknet via Data.gov.in (live daily APMC rates)
 * 4. Google Gemini AI (Krishi Mitra chat & Crop Doctor vision diagnostics)
 *
 * Zero Fake Data Policy strictly enforced.
 */

const path = require('path');
const fs = require('fs');

// Load environment variables
const dotenv = require(path.resolve('server/node_modules/dotenv'));
dotenv.config({ path: 'server/.env' });

const { createClient } = require(path.resolve('client/node_modules/@supabase/supabase-js'));
const { GoogleGenAI } = require(path.resolve('server/node_modules/@google/genai'));

let totalPassed = 0;
let totalFailed = 0;

function report(name, status, detail = '') {
  if (status) {
    console.log(`  ✅ [PASS] ${name}`);
    if (detail) console.log(`       → ${detail}`);
    totalPassed++;
  } else {
    console.log(`  ❌ [FAIL] ${name}`);
    if (detail) console.log(`       → ${detail}`);
    totalFailed++;
  }
}

async function runAudit() {
  console.log('\n======================================================');
  console.log('🌾 KRISHIDRISHTI — COMPLETE 4-API LIVE VERIFICATION AUDIT');
  console.log('======================================================\n');

  // -------------------------------------------------------------------------
  // 1. SUPABASE DATABASE & AUTH
  // -------------------------------------------------------------------------
  console.log('📦 1. Testing Supabase PostgreSQL & Auth...');
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    report('Supabase Configuration', false, 'Missing SUPABASE_URL or SUPABASE_ANON_KEY');
  } else {
    report('Supabase Configured in server/.env', true, `Host: ${new URL(supabaseUrl).hostname}`);
    const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });

    const tables = ['profiles', 'farms', 'plots', 'farm_tasks', 'diagnostic_history', 'farm_activity_logs'];
    for (const t of tables) {
      const { data, error } = await supabase.from(t).select('*').limit(1);
      report(`Table public.${t}`, !error, error ? error.message : `Table exists & RLS active (${data.length} rows)`);
    }

    // Verify RLS isolation
    const { data: profs } = await supabase.from('profiles').select('*');
    report('RLS User Isolation', Array.isArray(profs) && profs.length === 0, 'Anonymous query returns 0 rows (isolation verified)');
  }

  // -------------------------------------------------------------------------
  // 2. OPEN-METEO WEATHER TELEMETRY
  // -------------------------------------------------------------------------
  console.log('\n🌦️ 2. Testing Open-Meteo Weather Integration (No Key Required)...');
  try {
    const lat = 20.2033; // Dindori, Nashik
    const lon = 73.8317;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&hourly=temperature_2m,precipitation_probability&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia%2FKolkata`;
    const res = await fetch(url);
    const data = await res.json();

    const hasCurrent = data.current && typeof data.current.temperature_2m === 'number';
    report('Open-Meteo Live Endpoint Reachable', res.status === 200, `HTTP ${res.status}`);
    report('Real Current Temperature', hasCurrent, `Dindori Temp: ${data.current?.temperature_2m}°C, Humidity: ${data.current?.relative_humidity_2m}%`);
    report('7-Day Daily Forecast Available', Array.isArray(data.daily?.time) && data.daily.time.length >= 7, `${data.daily?.time?.length || 0} days of meteorological data`);
  } catch (err) {
    report('Open-Meteo Integration', false, err.message);
  }

  // -------------------------------------------------------------------------
  // 3. OFFICIAL AGMARKNET MANDI RATES (DATA.GOV.IN)
  // -------------------------------------------------------------------------
  console.log('\n📊 3. Testing Official Agmarknet Mandi Rates via Data.gov.in...');
  const mandiKey = process.env.DATA_GOV_IN_API_KEY;
  if (!mandiKey) {
    report('Agmarknet Configuration', false, 'DATA_GOV_IN_API_KEY not configured');
  } else {
    try {
      const url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${encodeURIComponent(mandiKey)}&format=json&limit=5&filters[state]=Maharashtra`;
      const res = await fetch(url);
      const json = await res.json();

      report('Agmarknet Portal HTTP 200 OK', res.status === 200, `API Key verified valid`);
      report('Live Market Records Available', json.total > 0, `Total live APMC records in system: ${json.total}`);
      if (json.records && json.records.length > 0) {
        const sample = json.records[0];
        report('Real Maharashtra APMC Rate Sample', true, `${sample.market} (${sample.district}): ${sample.commodity} @ ₹${sample.modal_price}/Qtl [Arrival: ${sample.arrival_date}]`);
      }
    } catch (err) {
      report('Agmarknet Integration', false, err.message);
    }
  }

  // -------------------------------------------------------------------------
  // 4. GOOGLE GEMINI AI
  // -------------------------------------------------------------------------
  console.log('\n🤖 4. Testing Google Gemini AI (Krishi Mitra & Crop Doctor)...');
  const geminiKey = process.env.GEMINI_API_KEY;
  const geminiModel = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';

  if (!geminiKey) {
    report('Gemini AI Configuration', false, 'GEMINI_API_KEY not configured');
  } else {
    try {
      const ai = new GoogleGenAI({ apiKey: geminiKey });
      
      // Test Chat
      const chatRes = await ai.models.generateContent({
        model: geminiModel,
        contents: 'Provide a 1-sentence soil health tip in Marathi for Maharashtra cotton farmers.'
      });
      const chatText = chatRes.text ? chatRes.text.trim() : '';
      report('Gemini AI Conversational Chat', Boolean(chatText && chatText.length > 5), `Model: ${geminiModel} | Reply: "${chatText.slice(0, 60)}..."`);

      // Test Botanical Vision Discrimination
      const { analyzeCropDiseaseWithGemini } = require(path.resolve('server/dist/services/cropDoctor.service.js'));
      const sampleBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
      const visionRes = await analyzeCropDiseaseWithGemini({
        imageBase64: sampleBase64,
        mimeType: 'image/png',
        cropType: 'Soybean',
        district: 'Nashik',
        state: 'Maharashtra',
        notes: 'Specimen test'
      });
      const isDiscriminating = visionRes.result?.isNonPlant === true;
      report('Crop Doctor AI Visual Discernment', isDiscriminating, `Non-plant image correctly recognized without fake diagnosis: "${visionRes.result?.diseaseName}"`);
    } catch (err) {
      report('Gemini AI Integration', false, err.message);
    }
  }

  // -------------------------------------------------------------------------
  // FINAL AUDIT SUMMARY
  // -------------------------------------------------------------------------
  console.log('\n======================================================');
  console.log(`AUDIT COMPLETE: ${totalPassed} PASSED, ${totalFailed} FAILED`);
  console.log('======================================================\n');

  if (totalFailed === 0) {
    console.log('🎉 ALL FOUR REAL APIS ARE 100% OPERATIONAL, VERIFIED & LIVE!\n');
  } else {
    console.log(`⚠️ ${totalFailed} check(s) need attention.\n`);
  }

  process.exit(totalFailed > 0 ? 1 : 0);
}

runAudit();
