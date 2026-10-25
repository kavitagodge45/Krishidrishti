import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

/**
 * In-memory sliding rate limiter for AI-intensive endpoints.
 * Limits requests to maxRequests per windowMs per IP.
 */
export const createRateLimiter = (maxRequests = 30, windowMs = 60 * 1000) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const rawIp = req.ip || req.socket?.remoteAddress || req.headers['x-forwarded-for'] || '127.0.0.1';
    const ip = Array.isArray(rawIp) ? rawIp[0] : String(rawIp);
    const now = Date.now();

    if (!store[ip] || now > store[ip].resetTime) {
      store[ip] = {
        count: 1,
        resetTime: now + windowMs
      };
      return next();
    }

    store[ip].count += 1;

    if (store[ip].count > maxRequests) {
      const retryAfterSec = Math.ceil((store[ip].resetTime - now) / 1000);
      res.set('Retry-After', String(retryAfterSec));
      res.status(429).json({
        success: false,
        status: 'ERROR',
        message: `Too many requests to AI endpoints. Please wait ${retryAfterSec} seconds before submitting another request.`,
        data: null,
        meta: {
          dataSource: 'Rate Limiter',
          apiStatus: 'Rate Limited',
          databaseStatus: 'Active',
          timestamp: new Date().toISOString()
        }
      });
      return;
    }

    next();
  };
};

export const aiRateLimiter = createRateLimiter(20, 60 * 1000); // 20 requests per minute
