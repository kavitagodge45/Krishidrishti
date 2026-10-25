import { config, geminiAI } from '../config/env.js';
import { AssistantChatRequest } from '../types/index.js';

export interface AssistantServiceResponse {
  text: string | null;
  unconfigured?: boolean;
  statusCode?: number;
  error?: string;
}

export const generateAssistantReplyWithGemini = async (
  request: AssistantChatRequest
): Promise<AssistantServiceResponse> => {
  if (!config.ai.isConfigured || !geminiAI) {
    return {
      text: null,
      unconfigured: true,
      statusCode: 503,
      error: 'Krishi Mitra AI conversational service is not configured. Please set GEMINI_API_KEY in server/.env.'
    };
  }

  const rawMsg = request.message ? request.message.trim() : '';
  if (!rawMsg) {
    return {
      text: null,
      statusCode: 400,
      error: 'Question message cannot be empty.'
    };
  }

  if (rawMsg.length > 2000) {
    return {
      text: null,
      statusCode: 400,
      error: 'Question exceeds maximum permitted length of 2,000 characters.'
    };
  }

  const lang = request.language === 'en' ? 'en' : request.language === 'hi' ? 'hi' : 'mr';

  const languageInstruction =
    lang === 'mr'
      ? 'Respond exclusively in authentic, natural Marathi (मराठी) using Devanagari script. Use terminology familiar to Maharashtra farmers (e.g., फवारणी, खते, कीटकनाशक, सिंचन, पाण्याचा निचरा, गट क्रमांक).'
      : lang === 'hi'
      ? 'Respond exclusively in authentic, natural Hindi (हिन्दी) using Devanagari script. Use farmer-friendly agricultural vocabulary.'
      : 'Respond in clear, professional English specifically contextualized for Indian agriculture.';

  const farmContextPrompt = request.farmContext
    ? `
FARMER FIELD CONTEXT:
- State / District: ${request.farmContext.state || 'Maharashtra'} / ${request.farmContext.district || 'Local district'}
- Taluka: ${request.farmContext.taluka || 'Local taluka'}
- Primary Soil Type: ${request.farmContext.soilType || 'Black Cotton Soil (काळी रेगूर जमीन)'}
- Farm Holding Area: ${request.farmContext.landAcres ? `${request.farmContext.landAcres} Acres` : 'Standard parcel'}
- Active Crops: ${request.farmContext.crops?.join(', ') || 'Kharif / Rabi crops'}
`
    : '';

  const systemInstruction = `
You are Krishi Mitra (कृषि मित्र), an expert agricultural advisory AI developed for Indian farmers by KrishiDrishti.
You are calibrated against Indian Council of Agricultural Research (ICAR) packages of practices and state agricultural university research (MPKV Rahuri, VNMKV Parbhani, PDKV Akola, Dr. BSKKV Dapoli).

LANGUAGE DIRECTIVE:
${languageInstruction}

${farmContextPrompt}

STRICT AGRI-INTEGRITY RULES:
1. Ground all recommendations in genuine agricultural science: integrated pest management (IPM), balanced crop nutrition, soil health, and water conservation.
2. For pests, diseases, or nutritional deficiencies: explain visible leaf/stem symptoms, cultural controls, organic remedies (e.g. 5ml/L Neem oil, Trichoderma harzianum), and targeted chemical interventions with safe field dilution rates (e.g. grams/ml per liter of water or per acre).
3. DO NOT FABRICATE LIVE DATA:
   - Do NOT invent current live weather (e.g. today's temperature or live rain forecast). If asked about live weather, inform the farmer that real-time meteorological data will be provided via KrishiDrishti's dedicated Weather Advisory section (connected via IMD/Open-Meteo), or refer them to mausam.imd.gov.in.
   - Do NOT invent today's live mandi prices. If asked about current mandi prices, explain that verified APMC wholesale auction rates are provided in the Mandi section (connected via Agmarknet), or refer them to agmarknet.gov.in.
   - Do NOT invent soil test values for fields that have not been tested.
4. For government schemes (e.g., PM-Kisan, MahaDBT, PMFBY, Soil Health Card), provide accurate official guidelines and portal instructions without inventing payment statuses.
5. Always advise farmer safety: wearing protective gloves and masks during spray operations, and never spraying during peak heat or against wind.
6. Maintain a supportive, respectful tone.
`;

  try {
    const contents: any[] = [];

    // Bounded conversation history (maximum 6 previous turns)
    if (Array.isArray(request.history) && request.history.length > 0) {
      const boundedHistory = request.history.slice(-6);
      for (const turn of boundedHistory) {
        if (turn && turn.role && Array.isArray(turn.parts) && turn.parts.length > 0) {
          const textPart = turn.parts[0]?.text;
          if (textPart && typeof textPart === 'string') {
            contents.push({
              role: turn.role === 'user' ? 'user' : 'model',
              parts: [{ text: textPart.slice(0, 1500) }]
            });
          }
        }
      }
    }

    // Add current user prompt with system instructions
    contents.push({
      role: 'user',
      parts: [
        { text: `${systemInstruction}\n\nFarmer Question: ${rawMsg}` }
      ]
    });

    const response = await geminiAI.models.generateContent({
      model: config.ai.modelName,
      contents
    });

    const replyText = response.text || '';
    if (!replyText.trim()) {
      throw new Error('Gemini API returned an empty response.');
    }

    return { text: replyText.trim() };
  } catch (err: any) {
    console.error('Krishi Mitra Gemini Conversational Error:', err);
    return {
      text: null,
      statusCode: 502,
      error: `Gemini conversational request failed: ${err.message}`
    };
  }
};
