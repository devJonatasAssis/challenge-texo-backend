import "reflect-metadata";
import { DataSource } from "typeorm";
import { Movie } from "./entities/Movie";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database/database.sqlite",
  synchronize: true,
  logging: false,
  entities: [Movie],
  migrations: [],
  subscribers: [],
});
