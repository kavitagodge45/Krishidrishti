import dotenv from 'dotenv';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  supabase: {
    url: process.env.SUPABASE_URL || '',
    anonKey: process.env.SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    isConfigured: Boolean(
      process.env.SUPABASE_URL &&
      process.env.SUPABASE_ANON_KEY &&
      !process.env.SUPABASE_URL.includes('your-project-id') &&
      !process.env.SUPABASE_ANON_KEY.includes('your-anon-key') &&
      process.env.SUPABASE_URL.startsWith('https://')
    )
  },
  ai: {
    geminiApiKey: process.env.GEMINI_API_KEY || '',
    modelName: process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite',
    isConfigured: Boolean(
      process.env.GEMINI_API_KEY &&
      !process.env.GEMINI_API_KEY.includes('your-gemini-key') &&
      process.env.GEMINI_API_KEY.trim().length > 15
    )
  }
};

export const supabase: SupabaseClient | null = config.supabase.isConfigured
  ? createClient(config.supabase.url, config.supabase.serviceRoleKey || config.supabase.anonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

export const geminiAI: GoogleGenAI | null = config.ai.isConfigured
  ? new GoogleGenAI({ apiKey: config.ai.geminiApiKey })
  : null;
