import dotenv from 'dotenv';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

// Resilient key extractors supporting Render's UI variants (with or without spaces/underscores)
const resolveEnv = (...keys: string[]): string => {
  for (const k of keys) {
    const val = process.env[k];
    if (val && typeof val === 'string' && val.trim().length > 0) {
      return val.trim();
    }
  }
  return '';
};

const geminiKey = resolveEnv(
  'GEMINI_API_KEY',
  'GEMINI API KEY',
  'VITE_GEMINI_API_KEY',
  'GOOGLE_API_KEY',
  'GEMINI_KEY'
);

const supabaseUrl = resolveEnv(
  'SUPABASE_URL',
  'SUPABASE URL',
  'VITE_SUPABASE_URL'
);

const supabaseAnonKey = resolveEnv(
  'SUPABASE_ANON_KEY',
  'SUPABASE ANON KEY',
  'VITE_SUPABASE_ANON_KEY'
);

const supabaseServiceKey = resolveEnv(
  'SUPABASE_SERVICE_ROLE_KEY',
  'SUPABASE SERVICE ROLE KEY',
  'SUPABASE_SERVICE_KEY'
);

const geminiModel = resolveEnv(
  'GEMINI_MODEL',
  'GEMINI MODEL'
) || 'gemini-2.0-flash';

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  supabase: {
    url: supabaseUrl,
    anonKey: supabaseAnonKey,
    serviceRoleKey: supabaseServiceKey || supabaseAnonKey,
    isConfigured: Boolean(
      supabaseUrl &&
      supabaseAnonKey &&
      !supabaseUrl.includes('your-project-id') &&
      !supabaseAnonKey.includes('your-anon-key') &&
      supabaseUrl.startsWith('https://')
    )
  },
  ai: {
    geminiApiKey: geminiKey,
    modelName: geminiModel,
    isConfigured: Boolean(
      geminiKey &&
      !geminiKey.includes('your-gemini-key') &&
      geminiKey.length > 15
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
