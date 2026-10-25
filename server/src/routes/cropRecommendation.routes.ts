import { Router } from 'express';
import { getSoilTypes, recommendCrops } from '../controllers/cropRecommendation.controller.js';

const router = Router();

router.get('/soil-types', getSoilTypes);
router.post('/recommend', recommendCrops);

export default router;
