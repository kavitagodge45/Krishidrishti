import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    status: 'ERROR',
    message,
    data: null,
    meta: {
      dataSource: 'KrishiDrishti Express Backend',
      apiStatus: 'Error Handled',
      databaseStatus: 'Active',
      timestamp: new Date().toISOString()
    }
  });
};

export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  res.status(404).json({
    success: false,
    status: 'ERROR',
    message: `Endpoint ${req.originalUrl} not found on KrishiDrishti server`,
    data: null,
    meta: {
      dataSource: 'KrishiDrishti Express Backend',
      apiStatus: 'Route Not Found',
      databaseStatus: 'Active',
      timestamp: new Date().toISOString()
    }
  });
};
