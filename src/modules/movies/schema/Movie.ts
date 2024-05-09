import { Schema, model } from 'mongoose';
import { MovieDTO } from '../model/MovieDTO';

const movieSchema = new Schema<MovieDTO>({
  title: { type: String, required: true },
  year: { type: String, required: true },
  studios: { type: String, required: true },
  producers: { type: String, required: true },
  winner: { type: String },
});

export const Movie = model<MovieDTO>('movie', movieSchema);
