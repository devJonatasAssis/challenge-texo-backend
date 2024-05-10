import { Router } from "express";

import { ProducersAwardsController } from "../../../../modules/movies/infra/http/controllers";

const routes = Router();

const producersAwardsController = new ProducersAwardsController();

// Producers who won awards every year
routes.get("/movies/producers-awards", producersAwardsController.show);

routes.get("/movie-teste", (req, res) => {
  return res.send({ ok: true });
});

export { routes };
