import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, AssistantChatRequest } from '../types/index.js';
import { config, supabase } from '../config/env.js';
import { generateAssistantReplyWithGemini } from '../services/assistant.service.js';

export const getFarmerProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!supabase || !req.user) {
      res.status(200).json({
        success: true,
        status: 'EMPTY',
        message: 'No farmer profile found. Sign in or register to access personalized agronomic assistance.',
        data: null,
        meta: {
          dataSource: 'Supabase profiles',
          apiStatus: 'Unauthenticated',
          databaseStatus: 'Online',
          timestamp: new Date().toISOString()
        }
      });
      return;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    res.status(200).json({
      success: true,
      status: data ? 'SUCCESS' : 'EMPTY',
      message: data ? 'Farmer profile loaded.' : 'No profile data recorded yet.',
      data,
      meta: {
        dataSource: 'Supabase profiles (RLS)',
        apiStatus: 'Live',
        databaseStatus: 'Online',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getQuickQueries = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const queries = [
      { id: 'q1', textEn: 'Foliar spray timing for soybean', textMr: 'सोयाबीनसाठी फवारणीची योग्य वेळ कोणती?', textHi: 'सोयाबीन के लिए पर्णीय छिड़काव का सही समय' },
      { id: 'q2', textEn: 'Onion thrips control protocol', textMr: 'कांद्यावरील फुलकिडे (थ्रिप्स) नियंत्रण उपाय', textHi: 'प्याज में थ्रिप्स कीट नियंत्रण के उपाय' },
      { id: 'q3', textEn: 'Kharif fertilizer schedule', textMr: 'खरीप पिकांसाठी खत व्यवस्थापन वेळापत्रक', textHi: 'खरीफ फसलों के लिए खाद प्रबंधन' }
    ];

    res.status(200).json({
      success: true,
      status: 'SUCCESS',
      message: 'Quick agronomy queries loaded.',
      data: queries,
      meta: {
        dataSource: 'ICAR Agronomy Templates',
        apiStatus: 'Static Verified',
        databaseStatus: 'Not Required',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};

export const chatWithAssistant = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { message, language, history, farmContext } = req.body as AssistantChatRequest;

    if (!message || typeof message !== 'string' || !message.trim()) {
      res.status(400).json({
        success: false,
        status: 'ERROR',
        message: 'Invalid request: "message" string is required and cannot be empty.',
        data: null,
        meta: {
          dataSource: 'KrishiDrishti Validation',
          apiStatus: 'Validation Failed',
          databaseStatus: 'Active',
          timestamp: new Date().toISOString()
        }
      });
      return;
    }

    if (message.length > 2000) {
      res.status(400).json({
        success: false,
        status: 'ERROR',
        message: 'Question exceeds maximum permitted length of 2,000 characters.',
        data: null,
        meta: {
          dataSource: 'KrishiDrishti Validation',
          apiStatus: 'Payload Too Large',
          databaseStatus: 'Active',
          timestamp: new Date().toISOString()
        }
      });
      return;
    }

    if (!config.ai.isConfigured) {
      res.status(503).json({
        success: false,
        status: 'UNCONFIGURED',
        message: 'Krishi Mitra AI service is unconfigured. Set GEMINI_API_KEY in server environment to enable genuine AI responses in Marathi, Hindi, and English.',
        data: null,
        meta: {
          dataSource: 'Google Gemini Pro / Flash LLM',
          apiStatus: 'Key Not Configured',
          databaseStatus: 'Active',
          timestamp: new Date().toISOString()
        }
      });
      return;
    }

    const { text, unconfigured, statusCode, error } = await generateAssistantReplyWithGemini({
      message,
      language: language || 'mr',
      history,
      farmContext
    });

    if (unconfigured) {
      res.status(503).json({
        success: false,
        status: 'UNCONFIGURED',
        message: error || 'Gemini AI conversational service is unconfigured.',
        data: null,
        meta: {
          dataSource: 'Google Gemini Pro / Flash LLM',
          apiStatus: 'Unconfigured',
          databaseStatus: 'Active',
          timestamp: new Date().toISOString()
        }
      });
      return;
    }

    if (error || !text) {
      res.status(statusCode || 502).json({
        success: false,
        status: 'ERROR',
        message: error || 'Failed to generate advisory response. Please try asking again.',
        data: null,
        meta: {
          dataSource: 'Google Gemini Pro / Flash LLM',
          apiStatus: 'API Error',
          databaseStatus: 'Active',
          timestamp: new Date().toISOString()
        }
      });
      return;
    }

    res.status(200).json({
      success: true,
      status: 'SUCCESS',
      message: 'Agricultural advisory generated successfully.',
      data: {
        reply: text,
        language: language || 'mr',
        model: config.ai.modelName,
        timestamp: new Date().toISOString()
      },
      meta: {
        dataSource: `Google Gemini (${config.ai.modelName})`,
        apiStatus: 'Live LLM Inference',
        databaseStatus: 'Active',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};
