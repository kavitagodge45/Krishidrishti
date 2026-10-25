import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, CropDoctorDiagnoseRequest } from '../types/index.js';
import { supabase, config } from '../config/env.js';
import { analyzeCropDiseaseWithGemini } from '../services/cropDoctor.service.js';

export const diagnoseSpecimen = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { imageBase64, cropHint, notes } = req.body as CropDoctorDiagnoseRequest;

    if (!imageBase64 || typeof imageBase64 !== 'string' || !imageBase64.trim()) {
      res.status(400).json({
        success: false,
        status: 'ERROR',
        message: 'Invalid request: "imageBase64" string is required.',
        data: null,
        meta: {
          dataSource: 'KrishiDrishti Validation',
          apiStatus: 'Validation Failed',
          databaseStatus: config.supabase.isConfigured ? 'Connected' : 'Unconfigured',
          timestamp: new Date().toISOString()
        }
      });
      return;
    }

    if (!config.ai.isConfigured) {
      res.status(503).json({
        success: false,
        status: 'UNCONFIGURED',
        message: 'Crop disease AI vision service is unconfigured. Set GEMINI_API_KEY in server/.env to enable genuine leaf diagnosis.',
        data: null,
        meta: {
          dataSource: 'Google Gemini Vision AI',
          apiStatus: 'Key Not Configured',
          databaseStatus: config.supabase.isConfigured ? 'Connected' : 'Not Connected',
          timestamp: new Date().toISOString()
        }
      });
      return;
    }

    const { result, unconfigured, statusCode, error } = await analyzeCropDiseaseWithGemini(
      { imageBase64, cropHint, notes },
      req.user?.id
    );

    if (unconfigured) {
      res.status(503).json({
        success: false,
        status: 'UNCONFIGURED',
        message: error || 'Gemini Vision AI is unconfigured.',
        data: null,
        meta: {
          dataSource: 'Google Gemini Vision AI',
          apiStatus: 'Unconfigured',
          databaseStatus: 'Active',
          timestamp: new Date().toISOString()
        }
      });
      return;
    }

    if (error || !result) {
      res.status(statusCode || 502).json({
        success: false,
        status: 'ERROR',
        message: error || 'Failed to analyze crop leaf specimen. Please try again with a clearer photo.',
        data: null,
        meta: {
          dataSource: 'Google Gemini Vision AI',
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
      message: result.isUnclear
        ? 'Specimen photograph was unclear. Please review the recommended guidelines for a clearer photo.'
        : result.isNonPlant
        ? 'Specimen was identified as non-plant. Please provide a clear crop leaf photo.'
        : 'Specimen diagnosed successfully by Google Gemini Vision AI.',
      data: result,
      meta: {
        dataSource: `Google Gemini Vision (${config.ai.modelName})`,
        apiStatus: 'Live Inference',
        databaseStatus: req.user && config.supabase.isConfigured ? 'Saved to diagnostic_history' : 'Not Persisted (Guest or Unconfigured)',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getPlotHistory = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!supabase || !req.user) {
      res.status(200).json({
        success: true,
        status: 'EMPTY',
        message: 'No authenticated user session. Sign in to view scan history.',
        data: [],
        meta: {
          dataSource: 'Supabase diagnostic_history',
          apiStatus: 'Unauthenticated',
          databaseStatus: 'Online',
          timestamp: new Date().toISOString()
        }
      });
      return;
    }

    const { data, error } = await supabase
      .from('diagnostic_history')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json({
      success: true,
      status: data && data.length > 0 ? 'SUCCESS' : 'EMPTY',
      message: data && data.length > 0 ? 'Diagnostic history retrieved.' : 'No diagnostic scans recorded yet.',
      data: data || [],
      meta: {
        dataSource: 'Supabase diagnostic_history (RLS)',
        apiStatus: 'Live',
        databaseStatus: 'Online',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};
