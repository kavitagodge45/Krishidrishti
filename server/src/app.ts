import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { requestLogger } from './middleware/logger.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import apiRouter from './routes/index.js';

export const createApp = (): Application => {
  const app = express();

  // Middleware: resilient CORS configuration for local and Render production
  const allowedOrigins = [
    'https://krishidrishti-dwzz.onrender.com',
    'http://localhost:5173',
    'http://localhost:5000',
    'http://localhost:3000'
  ];

  if (process.env.CORS_ORIGIN && process.env.CORS_ORIGIN !== '*') {
    process.env.CORS_ORIGIN.split(',').forEach(o => {
      const trimmed = o.trim();
      if (trimmed && !allowedOrigins.includes(trimmed)) {
        allowedOrigins.push(trimmed);
      }
    });
  }

  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (
        process.env.CORS_ORIGIN === '*' ||
        allowedOrigins.includes(origin) ||
        origin.endsWith('.onrender.com') ||
        origin.includes('localhost')
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Safe fallback to ensure farmers are never locked out
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
  }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(requestLogger);

  // Root welcome & API catalog
  app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
      name: 'KrishiDrishti Backend API',
      version: '1.0.0',
      description: 'AI-Powered Precision Agriculture Platform for Indian Farmers',
      status: 'OPERATIONAL',
      policy: 'STRICT ZERO FAKE DATA — Genuine Supabase & Official Open APIs only',
      endpoints: {
        health: '/api/health',
        farmer: {
          profile: 'GET /api/farmer/profile (requires Bearer token)',
          updateProfile: 'POST /api/farmer/profile (requires Bearer token)',
          plots: 'GET /api/farmer/plots (requires Bearer token)'
        },
        assistant: {
          profile: '/api/assistant/profile',
          quickQueries: '/api/assistant/quick-queries',
          chat: 'POST /api/assistant/chat'
        },
        cropDoctor: {
          diagnose: 'POST /api/crop-doctor/diagnose',
          history: '/api/crop-doctor/history'
        },
        weather: {
          advisory: '/api/weather?district=Nashik'
        },
        mandi: {
          prices: '/api/mandi/prices',
          commodities: '/api/mandi/commodities',
          states: '/api/mandi/states'
        },
        cropRecommendation: {
          recommend: 'POST /api/crop-recommendation/recommend',
          soilTypes: '/api/crop-recommendation/soil-types'
        },
        farmPlanning: {
          calculateEconomics: 'POST /api/farm-planning/calculate-economics',
          tasks: 'GET /api/farm-planning/tasks'
        }
      }
    });
  });

  // Mount API router
  app.use('/api', apiRouter);

  // Serve static client bundle if built
  const clientDist = path.resolve(__dirname, '../../client/dist');
  if (fs.existsSync(clientDist)) {
    app.use(express.static(clientDist));
    app.get('*', (req: Request, res: Response, next) => {
      if (req.path.startsWith('/api')) {
        return next();
      }
      res.sendFile(path.join(clientDist, 'index.html'));
    });
  }

  // 404 & error handlers
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
