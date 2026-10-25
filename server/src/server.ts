import { createApp } from './app.js';
import { config } from './config/env.js';

const app = createApp();

const server = app.listen(config.port, () => {
  console.log(`=======================================================`);
  console.log(`🌱 KrishiDrishti API Server is running on port ${config.port}`);
  console.log(`📍 URL: http://localhost:${config.port}`);
  console.log(`🩺 Health Check: http://localhost:${config.port}/api/health`);
  console.log(`🌾 Mode: ${config.nodeEnv}`);
  console.log(`🛡️ Supabase Status: ${config.supabase.isConfigured ? 'CONNECTED' : 'UNCONFIGURED (Clean safe mode)'}`);
  console.log(`🚫 Zero Fake Data Policy: ENFORCED`);
  console.log(`=======================================================`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server process terminated.');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server process terminated.');
  });
});
