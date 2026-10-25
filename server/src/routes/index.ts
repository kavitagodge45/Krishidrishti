import { Router } from 'express';
import healthRoutes from './health.routes.js';
import farmerRoutes from './farmer.routes.js';
import assistantRoutes from './assistant.routes.js';
import cropDoctorRoutes from './cropDoctor.routes.js';
import weatherRoutes from './weather.routes.js';
import mandiRoutes from './mandi.routes.js';
import cropRecommendationRoutes from './cropRecommendation.routes.js';
import farmPlanningRoutes from './farmPlanning.routes.js';

const apiRouter = Router();

apiRouter.use('/health', healthRoutes);
apiRouter.use('/farmer', farmerRoutes);
apiRouter.use('/assistant', assistantRoutes);
apiRouter.use('/crop-doctor', cropDoctorRoutes);
apiRouter.use('/weather', weatherRoutes);
apiRouter.use('/mandi', mandiRoutes);
apiRouter.use('/crop-recommendation', cropRecommendationRoutes);
apiRouter.use('/farm-planning', farmPlanningRoutes);

export default apiRouter;
