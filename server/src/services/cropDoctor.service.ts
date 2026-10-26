import { config, geminiAI, supabase } from '../config/env.js';
import { DiseaseDiagnosisResult, CropDoctorDiagnoseRequest } from '../types/index.js';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_BASE64_LENGTH = 14 * 1024 * 1024; // ~10.5 MB payload limit

export interface CropDoctorServiceResponse {
  result: DiseaseDiagnosisResult | null;
  unconfigured?: boolean;
  statusCode?: number;
  error?: string;
}

export const analyzeCropDiseaseWithGemini = async (
  request: CropDoctorDiagnoseRequest,
  userId?: string
): Promise<CropDoctorServiceResponse> => {
  if (!config.ai.isConfigured || !geminiAI) {
    return {
      result: null,
      unconfigured: true,
      statusCode: 503,
      error: 'Google Gemini Vision AI service is not configured. Please set GEMINI_API_KEY in server/.env.'
    };
  }

  try {
    let base64Data = request.imageBase64.trim();
    let mimeType = 'image/jpeg';

    // 1. Validate payload length
    if (base64Data.length > MAX_BASE64_LENGTH) {
      return {
        result: null,
        statusCode: 413,
        error: 'Image payload exceeds the maximum permitted limit of 10MB. Please upload a smaller or compressed photograph.'
      };
    }

    // 2. Extract and validate MIME type
    if (base64Data.startsWith('data:')) {
      const parts = base64Data.split(';base64,');
      if (parts.length === 2) {
        const mimeMatch = parts[0].match(/^data:(.*?)$/);
        if (mimeMatch && mimeMatch[1]) {
          mimeType = mimeMatch[1].toLowerCase();
        }
        base64Data = parts[1];
      }
    }

    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      return {
        result: null,
        statusCode: 400,
        error: `Unsupported image MIME type (${mimeType}). Only JPEG, PNG, and WebP crop images are supported.`
      };
    }

    // Basic base64 character sanity check
    if (!/^[A-Za-z0-9+/=]+$/.test(base64Data.replace(/\s+/g, ''))) {
      return {
        result: null,
        statusCode: 400,
        error: 'Invalid image data: payload contains corrupted or invalid base64 characters.'
      };
    }

    const promptText = `
You are an expert plant pathologist and agronomist calibrated against Indian Council of Agricultural Research (ICAR) plant pathology diagnostic standards.
Analyze the provided photograph of a crop leaf, stem, or fruit.
${request.cropHint ? `Farmer Crop Hint: "${request.cropHint}".` : ''}
${request.notes ? `Farmer Field Observations: "${request.notes}".` : ''}

STRICT PROTOCOL ON ACCURACY, OBJECTIVITY & HONESTY:
1. Examine the visual symptoms on the specimen with scientific rigour.
2. If the photo does not clearly depict plant tissue (e.g., human, animal, inanimate object, machinery), set "isNonPlant": true and "diseaseName": "Non-Crop Image / वनस्पतीचे छायाचित्र नाही".
3. If the photo is too blurry, out-of-focus, dark, or distant to make an accurate visual diagnosis, set "isUnclear": true and "diseaseName": "Unclear Specimen / अस्पष्ट छायाचित्र". Clearly explain why and request a sharper, well-lit close-up.
4. If the plant tissue is healthy with no significant pathogen, pest, or nutrient disorder, identify the crop and report "Healthy Crop / निरोगी पीक" with severity "Mild".
5. For identified disorders:
   - Identify crop name in English and Marathi/Hindi.
   - Identify disease/disorder name in English and Devanagari.
   - Provide scientific causal agent name (fungus, bacterium, virus, or nutrient deficiency).
   - Rate severity as "Mild", "Moderate", or "Severe".
   - Confidence score: Provide a number between 0 and 100 ONLY if you have genuine visual confidence in the symptom patterns; if uncertain, provide null. Do NOT invent a fake confidence score.
   - Describe observable symptoms and epidemiological triggers.
   - Describe any uncertainty or overlapping lookalike disorders (e.g. bacterial spot vs early blight).
   - Prescribe an Integrated Pest Management (IPM) treatment protocol: Cultural, Biological/Organic, and Chemical with standard dilution rates.
   - State recommended immediate next steps.

Return ONLY a valid JSON object matching this exact schema:
{
  "cropName": "Crop name (e.g. Tomato / टोमॅटो)",
  "diseaseName": "Disease or condition name (e.g. Early Blight / अगेती अंगमारी)",
  "scientificName": "Scientific causal name or Physiological Disorder",
  "severity": "Mild | Moderate | Severe",
  "confidenceScore": 88.5,
  "symptoms": ["Observable symptom 1", "Observable symptom 2"],
  "epidemiologicalTriggers": ["Climatic triggers favoring disease"],
  "criticalWeatherAlert": "Weather-aware foliar spray advice",
  "uncertainty": "Explanation of any uncertainty or differential lookalikes",
  "isUnclear": false,
  "isNonPlant": false,
  "recommendedNextSteps": ["Immediate next action 1", "Immediate next action 2"],
  "treatmentProtocol": [
    { "stepNumber": 1, "category": "Cultural & Agronomic Control", "description": "Specific action" },
    { "stepNumber": 2, "category": "Bio-Control & Organic Remedy", "description": "Specific action with biological agents" },
    { "stepNumber": 3, "category": "Chemical Treatment Option", "description": "Active chemical ingredient with safe field dilution" }
  ],
  "disclaimer": "This visual AI diagnosis is preliminary and indicative. It is not a definitive laboratory culture test. Please confirm with your local Krishi Vigyan Kendra (KVK) or agricultural extension officer before applying scheduled chemicals."
}
`;

    const candidateModels = [
      config.ai.modelName,
      'gemini-3.5-flash-lite',
      'gemini-flash-lite-latest',
      'gemini-3.8-flash'
    ].filter((m, i, arr) => m && arr.indexOf(m) === i && !m.includes('2.0') && !m.includes('2.5') && !m.includes('1.5'));

    if (!candidateModels.includes('gemini-3.5-flash-lite')) {
      candidateModels.unshift('gemini-3.5-flash-lite');
    }

    let response: any = null;
    let lastError: any = null;

    for (const model of candidateModels) {
      try {
        response = await geminiAI.models.generateContent({
          model,
          contents: [
            {
              role: 'user',
              parts: [
                { text: promptText },
                {
                  inlineData: {
                    mimeType,
                    data: base64Data
                  }
                }
              ]
            }
          ]
        });

        if (response && response.text && response.text.trim()) {
          break;
        }
      } catch (genErr: any) {
        lastError = genErr;
        console.warn(`Crop Doctor model ${model} failed, attempting next model...`, genErr.message?.slice(0, 120));
      }
    }

    const responseText = response?.text || '';
    if (!responseText.trim()) {
      throw lastError || new Error('Gemini Vision API returned an empty response.');
    }

    let parsed: any;
    try {
      const cleaned = responseText
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .trim();
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      const firstBrace = responseText.indexOf('{');
      const lastBrace = responseText.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        parsed = JSON.parse(responseText.substring(firstBrace, lastBrace + 1));
      } else {
        throw new Error(`Failed to parse AI vision model response as JSON: ${responseText.slice(0, 200)}...`);
      }
    }

    const caseReference = `#KDRi-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const diagnosisResult: DiseaseDiagnosisResult = {
      caseReference,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true }),
      cropName: parsed.cropName || 'Identified Specimen',
      diseaseName: parsed.diseaseName || 'Unspecified Condition',
      scientificName: parsed.scientificName || 'Botanical specimen',
      severity: ['Mild', 'Moderate', 'Severe'].includes(parsed.severity) ? parsed.severity : 'Moderate',
      confidenceScore: typeof parsed.confidenceScore === 'number'
        ? Math.min(100, Math.max(0, Math.round(parsed.confidenceScore * 10) / 10))
        : null,
      symptoms: Array.isArray(parsed.symptoms) && parsed.symptoms.length > 0
        ? parsed.symptoms
        : ['Visual inspection completed.'],
      epidemiologicalTriggers: Array.isArray(parsed.epidemiologicalTriggers) ? parsed.epidemiologicalTriggers : [],
      criticalWeatherAlert: parsed.criticalWeatherAlert || undefined,
      uncertainty: parsed.uncertainty || undefined,
      isUnclear: Boolean(parsed.isUnclear),
      isNonPlant: Boolean(parsed.isNonPlant),
      recommendedNextSteps: Array.isArray(parsed.recommendedNextSteps) && parsed.recommendedNextSteps.length > 0
        ? parsed.recommendedNextSteps
        : ['Isolate affected plants if localized.', 'Consult local agricultural extension center for physical inspection.'],
      treatmentProtocol: Array.isArray(parsed.treatmentProtocol) && parsed.treatmentProtocol.length > 0
        ? parsed.treatmentProtocol
        : [
            { stepNumber: 1, category: 'Cultural Control', description: 'Ensure adequate drainage and airflow through crop canopy.' },
            { stepNumber: 2, category: 'Organic Remedy', description: 'Apply 5ml/L cold-pressed Neem Oil as a preventive spray.' }
          ],
      disclaimer: parsed.disclaimer || 'This visual AI diagnosis is preliminary and indicative. Confirm with your local KVK or agricultural officer.',
      rawAnalysisText: responseText
    };

    // Save diagnosis history to Supabase only for authenticated users
    if (userId && supabase && config.supabase.isConfigured && !diagnosisResult.isNonPlant && !diagnosisResult.isUnclear) {
      try {
        await supabase.from('diagnostic_history').insert({
          user_id: userId,
          case_reference: caseReference,
          crop_name: diagnosisResult.cropName,
          disease_name: diagnosisResult.diseaseName,
          scientific_name: diagnosisResult.scientificName,
          severity: diagnosisResult.severity,
          confidence_score: diagnosisResult.confidenceScore,
          treatment_summary: diagnosisResult.treatmentProtocol.map(t => `${t.category}: ${t.description}`).join(' | '),
          status: 'Active'
        });

        await supabase.from('farm_activity_logs').insert({
          user_id: userId,
          title: `Crop Doctor: ${diagnosisResult.cropName}`,
          log_type: 'disease',
          description: `Diagnosed ${diagnosisResult.diseaseName} (${diagnosisResult.severity} severity). Reference: ${caseReference}`
        });
      } catch (dbErr) {
        console.error('Failed to persist diagnostic history to Supabase:', dbErr);
      }
    }

    return { result: diagnosisResult };
  } catch (err: any) {
    console.error('Crop Doctor Gemini Vision Error:', err);
    return {
      result: null,
      statusCode: 502,
      error: `Gemini Vision Analysis failed: ${err.message}`
    };
  }
};
