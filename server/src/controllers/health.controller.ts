import { Request, Response } from 'express';
import { getHealthStatus } from '../services/health.service.js';

export const checkHealth = (req: Request, res: Response): void => {
  const health = getHealthStatus();
  res.status(200).json({
    success: true,
    status: 'READY',
    message: 'KrishiDrishti API is healthy and operational.',
    data: health,
    meta: {
      dataSource: 'Internal Health Monitor',
      apiStatus: 'Online',
      databaseStatus: health.database.status,
      timestamp: new Date().toISOString()
    }
  });
};
