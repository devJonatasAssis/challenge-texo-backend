import { Router } from 'express';
import ProducersAwardsController from '../controllers/ProducersAwardsController';

const routes = Router();

const producersAwardsController = new ProducersAwardsController();

routes.get('/awards', producersAwardsController.show);

export default routes;
