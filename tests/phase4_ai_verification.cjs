const fs = require('fs');
const path = require('path');
const http = require('http');

console.log('====================================================');
console.log('🤖 KRISHIDRISHTI — PHASE 4 GEMINI AI INTEGRATION AUDIT');
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

// 1. CONFIGURATION & GITIGNORE AUDIT
console.log('1. Auditing AI Configuration, Environment Templates & Security...');
const gitignorePath = path.join(__dirname, '..', '.gitignore');
assert(fs.existsSync(gitignorePath), '.gitignore file exists in project root');
if (fs.existsSync(gitignorePath)) {
  const gitignore = fs.readFileSync(gitignorePath, 'utf8');
  assert(gitignore.includes('.env'), '.gitignore properly ignores .env files');
}

const serverEnvExamplePath = path.join(__dirname, '..', 'server', '.env.example');
assert(fs.existsSync(serverEnvExamplePath), 'server/.env.example template exists');
if (fs.existsSync(serverEnvExamplePath)) {
  const envExample = fs.readFileSync(serverEnvExamplePath, 'utf8');
  assert(envExample.includes('GEMINI_API_KEY='), 'server/.env.example defines GEMINI_API_KEY with empty placeholder');
  assert(envExample.includes('GEMINI_MODEL='), 'server/.env.example defines configurable GEMINI_MODEL');
  assert(!envExample.includes('AIzaSy'), 'Zero real API keys in .env.example');
}

// Verify no real Google API keys (AIzaSy...) are embedded in client bundle
const clientDist = path.join(__dirname, '..', 'client', 'dist', 'assets');
if (fs.existsSync(clientDist)) {
  const jsFiles = fs.readdirSync(clientDist).filter(f => f.endsWith('.js'));
  let foundRealKey = false;
  for (const f of jsFiles) {
    const content = fs.readFileSync(path.join(clientDist, f), 'utf8');
    if (content.match(/AIzaSy[A-Za-z0-9_-]{33}/)) {
      foundRealKey = true;
    }
  }
  assert(!foundRealKey, 'Zero real Gemini API keys leaked in client bundle');
}

// 2. HTTP SERVER SETUP
console.log('\n2. Testing HTTP Endpoints, Validations & Unconfigured Responses...');
const { createApp } = require('../server/dist/app.js');
const app = createApp();

const server = http.createServer(app);
server.listen(0, '127.0.0.1', async () => {
  const port = server.address().port;

  function sendRequest(method, endpoint, body = null, headers = {}) {
    return new Promise((resolve, reject) => {
      const dataStr = body ? JSON.stringify(body) : null;
      const reqHeaders = { ...headers };
      if (dataStr) {
        reqHeaders['Content-Type'] = 'application/json';
        reqHeaders['Content-Length'] = Buffer.byteLength(dataStr);
      }

      const req = http.request({
        host: '127.0.0.1',
        port: port,
        path: endpoint,
        method: method,
        headers: reqHeaders
      }, (res) => {
        let respBody = '';
        res.on('data', chunk => respBody += chunk);
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(respBody) });
          } catch (e) {
            resolve({ status: res.statusCode, body: respBody });
          }
        });
      });

      req.on('error', reject);
      if (dataStr) req.write(dataStr);
      req.end();
    });
  }

  try {
    // 2.1 Input Validations
    const emptyDoc = await sendRequest('POST', '/api/crop-doctor/diagnose', {});
    assert(emptyDoc.status === 400, 'POST /api/crop-doctor/diagnose rejects missing image with 400 Bad Request');

    const wsDoc = await sendRequest('POST', '/api/crop-doctor/diagnose', { imageBase64: '   ' });
    assert(wsDoc.status === 400, 'POST /api/crop-doctor/diagnose rejects whitespace image with 400 Bad Request');

    const emptyChat = await sendRequest('POST', '/api/assistant/chat', {});
    assert(emptyChat.status === 400, 'POST /api/assistant/chat rejects missing message with 400 Bad Request');

    const longChat = await sendRequest('POST', '/api/assistant/chat', { message: 'x'.repeat(2500) });
    assert(longChat.status === 400, 'POST /api/assistant/chat rejects message > 2000 chars with 400 Bad Request');

    // 2.2 Unconfigured State Checks (Without GEMINI_API_KEY)
    const envConfig = require('../server/dist/config/env.js').config;
    if (!envConfig.ai.isConfigured) {
      const unconfDoc = await sendRequest('POST', '/api/crop-doctor/diagnose', {
        imageBase64: 'data:image/jpeg;base64,dGVzdA=='
      });
      assert(unconfDoc.status === 503, 'Crop Doctor returns 503 Service Unavailable when GEMINI_API_KEY is unconfigured');
      assert(unconfDoc.body.status === 'UNCONFIGURED', 'Crop Doctor returns honest UNCONFIGURED status');

      const unconfChat = await sendRequest('POST', '/api/assistant/chat', {
        message: 'सोयाबीन पेरणी कधी करावी?'
      });
      assert(unconfChat.status === 503, 'Krishi Mitra returns 503 Service Unavailable when GEMINI_API_KEY is unconfigured');
      assert(unconfChat.body.status === 'UNCONFIGURED', 'Krishi Mitra returns honest UNCONFIGURED status');
    }

    // 2.3 Guest access vs Authenticated access
    const guestHistory = await sendRequest('GET', '/api/crop-doctor/history');
    assert(guestHistory.status === 200, 'GET /api/crop-doctor/history allows guest requests safely');
    assert(Array.isArray(guestHistory.body.data) && guestHistory.body.data.length === 0, 'Guest receives empty history array without error');

    // 3. MOCKED GEMINI PIPELINE & RESILIENCE TESTS
    console.log('\n3. Testing Model Response Transformations with Mocked Gemini Engine...');
    console.log('   (Verifies JSON parsing, symptom mapping, confidence limits, and error handling)');

    const cropDoctorService = require('../server/dist/services/cropDoctor.service.js');
    const assistantService = require('../server/dist/services/assistant.service.js');
    const envModule = require('../server/dist/config/env.js');

    // Temporarily mock geminiAI client for pipeline verification
    const originalAi = envModule.geminiAI;
    const originalIsConfigured = envModule.config.ai.isConfigured;

    envModule.config.ai.isConfigured = true;

    // Test 3.1: Valid Leaf Disease Diagnosis Output
    envModule.geminiAI = {
      models: {
        generateContent: async () => ({
          text: JSON.stringify({
            cropName: 'Tomato (टोमॅटो)',
            diseaseName: 'Early Blight (Alternaria solani) / अर्ली ब्लाइट',
            scientificName: 'Alternaria solani',
            severity: 'Moderate',
            confidenceScore: 92.4,
            symptoms: ['Concentric dark brown target rings on lower leaves'],
            epidemiologicalTriggers: ['Relative humidity > 80% with warm daytime temperatures'],
            criticalWeatherAlert: 'Ensure spray 2 hours before night dew.',
            uncertainty: 'Visual target spots are characteristic, but confirm lack of bacterial speck halo.',
            isUnclear: false,
            isNonPlant: false,
            recommendedNextSteps: ['Prune lowest 4 inches of infected foliage and burn outside field.'],
            treatmentProtocol: [
              { stepNumber: 1, category: 'Cultural Control', description: 'Switch from overhead irrigation to drip line.' },
              { stepNumber: 2, category: 'Organic Remedy', description: 'Spray Trichoderma harzianum @ 5g/L water.' },
              { stepNumber: 3, category: 'Chemical Option', description: 'Spray Mancozeb 75% WP @ 2.5g/L water in calm winds.' }
            ],
            disclaimer: 'Visual AI diagnosis is indicative. Verify with your local KVK.'
          })
        })
      }
    };

    const validDiagRes = await cropDoctorService.analyzeCropDiseaseWithGemini({
      imageBase64: 'data:image/jpeg;base64,dGVzdGltYWdlZGF0YQ=='
    });
    assert(validDiagRes.result !== null, 'Model response successfully transformed to DiseaseDiagnosisResult');
    assert(validDiagRes.result.cropName.includes('Tomato'), 'Crop host correctly mapped (Tomato)');
    assert(validDiagRes.result.confidenceScore === 92.4, 'Confidence score strictly preserved from model (92.4%)');
    assert(validDiagRes.result.treatmentProtocol.length === 3, 'All 3 IPM treatment steps mapped');

    // Test 3.2: Unclear Image Detection
    envModule.geminiAI = {
      models: {
        generateContent: async () => ({
          text: JSON.stringify({
            cropName: 'Unknown',
            diseaseName: 'Unclear Specimen / अस्पष्ट छायाचित्र',
            scientificName: 'Inconclusive',
            severity: 'Mild',
            confidenceScore: null,
            symptoms: ['Specimen is out of focus and underexposed.'],
            isUnclear: true,
            isNonPlant: false,
            recommendedNextSteps: ['Take a clear, well-lit photo in natural daylight focusing on single leaf.'],
            treatmentProtocol: [],
            disclaimer: 'Cannot reliably diagnose an unclear photo.'
          })
        })
      }
    };

    const unclearRes = await cropDoctorService.analyzeCropDiseaseWithGemini({
      imageBase64: 'data:image/jpeg;base64,Ymx1cnJ5'
    });
    assert(unclearRes.result && unclearRes.result.isUnclear === true, 'Correctly flags unclear specimen without inventing diagnosis');
    assert(unclearRes.result.confidenceScore === null, 'Confidence score is null for unclear image');

    // Test 3.3: Non-Plant Specimen Detection
    envModule.geminiAI = {
      models: {
        generateContent: async () => ({
          text: JSON.stringify({
            cropName: 'Non-Plant',
            diseaseName: 'Non-Crop Image / वनस्पतीचे छायाचित्र नाही',
            scientificName: 'Non-botanical',
            severity: 'Mild',
            confidenceScore: null,
            symptoms: ['No botanical leaf or crop structures detected.'],
            isUnclear: false,
            isNonPlant: true,
            recommendedNextSteps: ['Please upload an image of a plant leaf, stem, or fruit.'],
            treatmentProtocol: [],
            disclaimer: 'Diagnosis is restricted to agricultural crops.'
          })
        })
      }
    };

    const nonPlantRes = await cropDoctorService.analyzeCropDiseaseWithGemini({
      imageBase64: 'data:image/jpeg;base64,bm9ucGxhbnQ='
    });
    assert(nonPlantRes.result && nonPlantRes.result.isNonPlant === true, 'Correctly flags non-plant image without inventing diagnosis');

    // Test 3.4: Krishi Mitra Multilingual Chat (Marathi)
    envModule.geminiAI = {
      models: {
        generateContent: async (params) => {
          const prompt = params.contents[0].parts[0].text;
          if (prompt.includes('Marathi')) {
            return { text: 'रामराम शेतकरी मित्र! सोयाबीन पिकासाठी हेक्टरी २० किलो नत्र, ६० किलो स्फुरद व ४० किलो पालाशची शिफारस केली जाते.' };
          } else if (prompt.includes('Hindi')) {
            return { text: 'नमस्ते किसान मित्र! सोयाबीन की फसल के लिए प्रति हेक्टेयर 20 किग्रा नाइट्रोजन, 60 किग्रा फास्फोरस की आवश्यकता होती है।' };
          }
          return { text: 'Hello farmer! For soybean, recommended basal NPK dose is 20:60:40 kg per hectare.' };
        }
      }
    };

    const marathiChatRes = await assistantService.generateAssistantReplyWithGemini({
      message: 'सोयाबीनसाठी खतांची मात्रा काय असावी?',
      language: 'mr'
    });
    assert(marathiChatRes.text && marathiChatRes.text.includes('सोयाबीन'), 'Krishi Mitra generates authentic Marathi response');

    const hindiChatRes = await assistantService.generateAssistantReplyWithGemini({
      message: 'सोयाबीन के लिए खाद प्रबंधन बताएं',
      language: 'hi'
    });
    assert(hindiChatRes.text && hindiChatRes.text.includes('सोयाबीन'), 'Krishi Mitra generates authentic Hindi response');

    const englishChatRes = await assistantService.generateAssistantReplyWithGemini({
      message: 'What is the fertilizer schedule for soybean?',
      language: 'en'
    });
    assert(englishChatRes.text && englishChatRes.text.includes('soybean'), 'Krishi Mitra generates English response');

    // Test 3.5: Gemini API Failure & Resilient 502 Error Handling
    envModule.geminiAI = {
      models: {
        generateContent: async () => {
          throw new Error('503 Service Unavailable: High upstream model load / quota exceeded');
        }
      }
    };

    const failedChatRes = await assistantService.generateAssistantReplyWithGemini({
      message: 'Hello'
    });
    assert(failedChatRes.statusCode === 502, 'API failure returns 502 Bad Gateway');
    assert(failedChatRes.text === null, 'Never falls back to fake answers when API fails');

    // Restore original configuration
    envModule.geminiAI = originalAi;
    envModule.config.ai.isConfigured = originalIsConfigured;

    server.close(() => {
      console.log('\n====================================================');
      console.log(`Phase 4 Verification Complete: ${passCount} Passed, ${failCount} Failed.`);
      console.log('====================================================');
      process.exit(failCount > 0 ? 1 : 0);
    });
  } catch (err) {
    console.error('Audit execution error:', err);
    server.close();
    process.exit(1);
  }
});
