import "reflect-metadata";

import express from "express";
import fs from "node:fs";
import { join } from "node:path";

import "../../container";

import { AppDataSource } from "../../../data-source";
import { Movie } from "../../../modules/movies/infra/typeorm/entities/Movie";

import { parse } from "csv-parse";
import routes from "./routes";

interface Movies {
  title: string;
  year: string;
  producers: string;
  studios: string;
  winner: string;
}

AppDataSource.initialize()
  .then(async () => {
    const movieRepository = AppDataSource.getRepository(Movie);

    const fileCSV = join(__dirname, "..", "..", "..", "..", "movielist.csv");

    const movies: Movies[] = [];

    const stream = fs.createReadStream(fileCSV);
    const parseFile = parse({ delimiter: ";" });
    let firstLine = true;

    stream.pipe(parseFile);

    parseFile
      .on("data", async (line) => {
        if (firstLine) {
          firstLine = false;
          return;
        }

        const [year, title, studios, producers, winner] = line;

        movies.push({
          year,
          title,
          studios,
          producers,
          winner,
        });
      })
      .on("end", async () => {
        for (const value of movies) {
          const findUserExists = await movieRepository.findOne({
            where: { title: value.title },
          });

          if (!findUserExists) {
            await movieRepository.save({
              producers: value.producers,
              studios: value.studios,
              title: value.title,
              winner: value.winner,
              year: value.year,
            });
          }
        }
      })
      .on("error", (err) => {
        console.error(err);
      });
  })
  .catch((error) => console.log(error));

const app = express();

app.use(express.json());
app.use(routes);

app.listen(3333, () => {
  console.log("🚀 Server is running on port 3333");
});
