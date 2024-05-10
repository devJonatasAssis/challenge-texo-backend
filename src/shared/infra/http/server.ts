import connect from "../../../../database/connect";
import { join } from "node:path";
import fs from "node:fs";

import { MovieDTO } from "@modules/movies/model/MovieDTO";
import { parse } from "csv-parse";
import { Movie } from "../../../modules/movies/schema";
import { app } from "./app";

const PORT = 3333;

// Connection DB MongoServerMemory, transforming csv in json and creating new Movies
connect()
    .then(() => {
      const fileCSV = join(__dirname, "..", "..", "..", "..", "movielist.csv");
      const movies: MovieDTO[] = [];
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
            const movie = new Movie({
              year: value.year,
              title: value.title,
              studios: value.studios,
              producers: value.producers,
              winner: value.winner,
            });
            await movie.save();
          }
        })
        .on("error", (err) => {
          console.error(err);
        });
    })
    .then(() => {
      console.log('DB In Memory successfully initialized.')
    })
    .then(() => {
      app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`))
    });
