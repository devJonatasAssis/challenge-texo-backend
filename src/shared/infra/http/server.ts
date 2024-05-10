import connect from "../../../../database/connect";
import { join } from "node:path";

import { Movie } from "../../../modules/movies/schema";
import { app } from "./app";
import csv from 'csvtojson'

const PORT = 3333;

// Connection DB MongoServerMemory, transforming csv in json and creating new Movies
connect()
    .then(async () => {
      const file = join(__dirname, "..", "..", "..", "..", "movielist.csv");
      const movieList = await csv({delimiter: ';'}).fromFile(file)

      for (const value of movieList) {
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
    .then(() => {
      console.log('DB In Memory successfully initialized.')
    })
    .then(() => {
      app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`))
    });
