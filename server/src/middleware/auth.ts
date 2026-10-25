import { Response, NextFunction } from 'express';
import { supabase, config } from '../config/env.js';
import { AuthenticatedRequest } from '../types/index.js';

/**
 * Strict authentication middleware: Rejects unauthenticated requests with 401.
 */
export const requireAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!config.supabase.isConfigured || !supabase) {
    res.status(503).json({
      success: false,
      status: 'UNCONFIGURED',
      message: 'Supabase authentication service is not configured. Please supply SUPABASE_URL and SUPABASE_ANON_KEY in server environment variables.',
      data: null,
      meta: {
        dataSource: 'KrishiDrishti Auth Middleware',
        apiStatus: 'Unconfigured',
        databaseStatus: 'Not Connected',
        timestamp: new Date().toISOString()
      }
    });
    return;
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      status: 'ERROR',
      message: 'Authentication required. Missing Bearer token in Authorization header.',
      data: null,
      meta: {
        dataSource: 'KrishiDrishti Auth Middleware',
        apiStatus: 'Unauthorized',
        databaseStatus: 'Online',
        timestamp: new Date().toISOString()
      }
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      res.status(401).json({
        success: false,
        status: 'ERROR',
        message: 'Invalid, expired, or revoked authentication token.',
        data: null,
        meta: {
          dataSource: 'Supabase Auth',
          apiStatus: 'Unauthorized',
          databaseStatus: 'Online',
          timestamp: new Date().toISOString()
        }
      });
      return;
    }

    req.user = user;
    next();
  } catch (err: any) {
    res.status(500).json({
      success: false,
      status: 'ERROR',
      message: `Authentication verification error: ${err.message}`,
      data: null,
      meta: {
        dataSource: 'KrishiDrishti Auth Middleware',
        apiStatus: 'Internal Error',
        databaseStatus: 'Error',
        timestamp: new Date().toISOString()
      }
    });
  }
};

/**
 * Optional authentication middleware:
 * Attaches user to req.user if a valid token is present, but allows guests to proceed without blocking.
 */
export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  if (!config.supabase.isConfigured || !supabase) {
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    const { data: { user } } = await supabase.auth.getUser(token);
    if (user) {
      req.user = user;
    }
  } catch (err) {
    // Continue as guest if token is invalid or expired
  }
  next();
};
