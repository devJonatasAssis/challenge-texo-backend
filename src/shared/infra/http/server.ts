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

const app = express();

app.use(express.json());
app.use(routes);

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
