import { config } from '../config/env.js';

export const getHealthStatus = () => {
  return {
    server: 'KrishiDrishti API Server',
    status: 'ONLINE',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    database: {
      provider: 'Supabase PostgreSQL',
      status: config.supabase.isConfigured ? 'CONFIGURED' : 'UNCONFIGURED',
      note: config.supabase.isConfigured 
        ? 'Connected to Supabase PostgreSQL with Row Level Security (RLS)' 
        : 'Pending SUPABASE_URL and SUPABASE_ANON_KEY in server/.env'
    },
    integrations: {
      supabaseAuth: {
        status: config.supabase.isConfigured ? 'READY' : 'UNCONFIGURED',
        note: 'JWT token verification & RLS user isolation'
      },
      geminiAi: {
        status: config.ai.isConfigured ? 'READY' : 'PENDING_INTEGRATION',
        note: 'Gemini 1.5/2.0 API for crop vision and trilingual agronomic advisory'
      },
      openMeteoWeather: {
        status: 'READY_PHASE_5',
        note: 'Direct live Open-Meteo proxy without mock fallbacks'
      },
      agmarknetMandi: {
        status: 'READY_PHASE_6',
        note: 'Direct Agmarknet/data.gov.in commodity rate integration'
      }
    }
  };
};
