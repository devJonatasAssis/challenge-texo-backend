import 'reflect-metadata';

import express from 'express';

import '../../container';

import { parse } from 'csv-parse';
import routes from './routes';
import connect from '../../../../database/connect';
import { Movie } from '../../../modules/movies/schema/Movie';
import { join } from 'node:path';
import fs from 'node:fs';
import { MovieDTO } from '@modules/movies/model/MovieDTO';

// AppDataSource.initialize()
//   .then(async () => {
//     const movieRepository = AppDataSource.getRepository(Movie);

//     const fileCSV = join(__dirname, "..", "..", "..", "..", "movielist.csv");

//     const movies: Movies[] = [];

//     const stream = fs.createReadStream(fileCSV);
//     const parseFile = parse({ delimiter: ";" });
//     let firstLine = true;

//     stream.pipe(parseFile);

//     parseFile
//       .on("data", async (line) => {
//         if (firstLine) {
//           firstLine = false;
//           return;
//         }

//         const [year, title, studios, producers, winner] = line;

//         movies.push({
//           year,
//           title,
//           studios,
//           producers,
//           winner,
//         });
//       })
//       .on("end", async () => {
//         for (const value of movies) {
//           const findUserExists = await movieRepository.findOne({
//             where: { title: value.title },
//           });

//           if (!findUserExists) {
//             await movieRepository.save({
//               producers: value.producers,
//               studios: value.studios,
//               title: value.title,
//               winner: value.winner,
//               year: value.year,
//             });
//           }
//         }
//       })
//       .on("error", (err) => {
//         console.error(err);
//       });
//   })
//   .catch((error) => console.log(error));

const app = express();

app.use(express.json());
app.use(routes);

// app.use(function (req, res, next) {
//   const fileCSV = join(__dirname, "..", "..", "..", "..", "movielist.csv");
//   const movies: Movies[] = [];

//   const stream = fs.createReadStream(fileCSV);

//   const parseFile = parse({ delimiter: ";" });
//   let firstLine = true;

//   stream.pipe(parseFile);

//   parseFile
//     .on("data", async (line) => {
//       if (firstLine) {
//         firstLine = false;
//         return;
//       }

//       const [year, title, studios, producers, winner] = line;

//       movies.push({
//         year,
//         title,
//         studios,
//         producers,
//         winner,
//       });
//     })
//     .on("end", async () => {
//       for (const value of movies) {
//         database.create({
//           ...value,
//         });
//       }
//     })
//     .on("error", (err) => {
//       console.log("Deu erro");
//       console.error(err);
//     });
//   next();
// });

connect()
  .then(async () => {
    const fileCSV = join(__dirname, '..', '..', '..', '..', 'movielist.csv');

    const movies: MovieDTO[] = [];

    const stream = fs.createReadStream(fileCSV);

    const parseFile = parse({ delimiter: ';' });
    let firstLine = true;

    stream.pipe(parseFile);

    parseFile
      .on('data', async line => {
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
      .on('end', async () => {
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
      .on('error', err => {
        console.error(err);
      });
  })
  .then(() => {
    app.listen(3333, async () => {
      console.log('🚀 Server is running on port 3333');
    });
  })
  .catch(error => {
    console.log('Invalid Database Connection');
  });
