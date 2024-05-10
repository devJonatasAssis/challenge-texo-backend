import "reflect-metadata";

import express from "express";

import "../../container";
import { routes } from "./routes/routes";

const app: express.Application = express();

app.use(express.json());
app.use(routes);

export { app };
