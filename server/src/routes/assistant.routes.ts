import { Router } from 'express';
import { getFarmerProfile, getQuickQueries, chatWithAssistant } from '../controllers/assistant.controller.js';
import { optionalAuth } from '../middleware/auth.js';
import { aiRateLimiter } from '../middleware/rateLimit.js';

const router = Router();

router.get('/profile', optionalAuth, getFarmerProfile);
router.get('/quick-queries', getQuickQueries);
router.post('/chat', optionalAuth, aiRateLimiter, chatWithAssistant);

export default router;
