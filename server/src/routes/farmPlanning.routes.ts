import { Router } from 'express';
import { calculateEconomics, getTasks } from '../controllers/farmPlanning.controller.js';

const router = Router();

router.post('/calculate-economics', calculateEconomics);
router.get('/tasks', getTasks);

export default router;
