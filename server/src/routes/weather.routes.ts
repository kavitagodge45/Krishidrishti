import { Router } from 'express';
import { getWeatherAdvisory } from '../controllers/weather.controller.js';

const router = Router();
router.get('/', getWeatherAdvisory);

export default router;
