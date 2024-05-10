import { MongoMemoryServer } from "mongodb-memory-server";
import { app } from "../../../../../shared/infra/http/app";
import mongoose from "mongoose";
import { Movie } from "../../../../../modules/movies/schema";
import { join } from "path";
import csv from "csvtojson/v2";
import request from "supertest";

const file = join(
  __dirname,
  "..",
  "..",
  "..",
  "..",
  "..",
  "..",
  "movielist.csv"
);

describe("Movie Test - GET /movies/producers-awards", () => {
  let mongodb: MongoMemoryServer;

  beforeAll(async () => {
    mongodb = await MongoMemoryServer.create();
    const uri = mongodb.getUri();
    await mongoose.connect(uri, { dbName: "texo-challenge" });

    const movieListArray = await csv({ delimiter: ";" }).fromFile(file);

    for (const value of movieListArray) {
      const movie = new Movie({
        title: value.title,
        year: value.year,
        producers: value.producers,
        studios: value.studios,
        winner: value.winner,
      });

      await movie.save();
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongodb.stop();
  });

  it("should be to list the the winning producers with a time interval", async () => {
    const response = await request(app).get("/movies/producers-awards");

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("min");
    expect(response.body).toHaveProperty("max");
    expect(response.body).not.toEqual({ min: [[]], max: [[]] });
  });
});
