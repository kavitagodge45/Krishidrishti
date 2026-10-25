import { Router } from 'express';
import { diagnoseSpecimen, getPlotHistory } from '../controllers/cropDoctor.controller.js';
import { optionalAuth, requireAuth } from '../middleware/auth.js';
import { aiRateLimiter } from '../middleware/rateLimit.js';

const router = Router();

// Diagnose leaf specimen (supports both guest farmers and logged in farmers)
router.post('/diagnose', optionalAuth, aiRateLimiter, diagnoseSpecimen);

// Diagnostic history requires authentication
router.get('/history', optionalAuth, getPlotHistory);

export default router;
