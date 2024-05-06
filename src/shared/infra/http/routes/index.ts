import { Router } from "express";

import moviesRoutes from "../../../../modules/movies/infra/http/routes/movies.routes";

const app = Router();

app.use("/movies", moviesRoutes);

export default app;
