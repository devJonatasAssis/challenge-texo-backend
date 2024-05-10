import { MongoMemoryServer } from "mongodb-memory-server";
import { app } from "../../../../../shared/infra/http/app";
import request from "supertest";
import mongoose from "mongoose";
import { Movie } from "../../../../../modules/movies/schema";
import { mockMovielist } from "../../helper/mockMovielist";

describe("Movie Test - GET /movies/producers-awards", () => {
  let mongodb: MongoMemoryServer;

  beforeAll(async () => {
    mongodb = await MongoMemoryServer.create();
    const uri = mongodb.getUri();
    await mongoose.connect(uri, { dbName: "texo-challenge" });

    for (const value of mockMovielist) {
      const movie = new Movie({
        producers: value.producers,
        studios: value.studios,
        title: value.title,
        winner: value.winner,
        year: value.year,
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
