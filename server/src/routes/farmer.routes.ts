import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getFarmerProfile, updateFarmerProfile, getFarmerPlots } from '../controllers/farmer.controller.js';

const router = Router();

router.use(requireAuth);
router.get('/profile', getFarmerProfile);
router.post('/profile', updateFarmerProfile);
router.get('/plots', getFarmerPlots);

export default router;
