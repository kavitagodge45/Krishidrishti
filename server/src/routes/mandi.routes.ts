import { Router } from 'express';
import { getMandiPrices, getCommodities, getStates } from '../controllers/mandi.controller.js';

const router = Router();

router.get('/prices', getMandiPrices);
router.get('/commodities', getCommodities);
router.get('/states', getStates);

export default router;
