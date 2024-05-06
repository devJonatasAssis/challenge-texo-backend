import IProducersAwardsRepository from "../../../../modules/movies/typeorm/repositories/IProducersAwardsRepository";
import { AppDataSource } from "../../../../../src/data-source";
import { Movie } from "../../../../entities/Movie";
import { Repository } from "typeorm";

interface ProducersProps {
  producers: string;
  year: number;
}

interface ProducerResponse {
  producer: string;
  interval: number;
  previousWin: number;
  followingWin: number;
}

export class ProducersAwardsRepository implements IProducersAwardsRepository {
  private ormRepository: Repository<Movie>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(Movie);
  }

  private getYearsInterval(producers: any) {
    let maxInterval: number | undefined;
    let minInterval: number | undefined;

    let minResult: ProducerResponse[] = [];
    let maxResult: ProducerResponse[] = [];

    let resultProducers: any[] = [];

    producers.forEach((items: ProducersProps) => {
      const producersSplit = items.producers.split(", ");

      const listProducers = producersSplit.map((item: any) => {
        return {
          producer: item.split(" and "),
          year: items.year,
        };
      });

      for (const producers of listProducers) {
        for (const value of producers.producer) {
          resultProducers.push({
            producer: value,
            year: items.year,
          });
        }
      }
    });

    const groupProducersAwardsYears = resultProducers.reduce(
      (acc, { producer, year }) => {
        if (!acc[producer]) acc[producer] = [];
        acc[producer].push(year);
        return acc;
      }
    );

    const formatResultProduceAwards = Object.keys(
      groupProducersAwardsYears
    ).map((item) => {
      return {
        producer: item,
        years: groupProducersAwardsYears[item],
      };
    });

    formatResultProduceAwards.forEach(({ producer, years }, index) => {
      if (index > 1 && years.length === 2) {
        const subtractedYears = Number(years[1]) - Number(years[0]);

        const result: ProducerResponse = {
          producer,
          interval: subtractedYears,
          previousWin: Number(years[0]),
          followingWin: Number(years[1]),
        };

        if (!maxInterval && !minInterval) {
          maxInterval = subtractedYears;
          minInterval = subtractedYears;
        }

        if (maxInterval && maxInterval < subtractedYears) {
          maxInterval = subtractedYears;
          maxResult.push(result);
        }

        if (minInterval && minInterval >= subtractedYears) {
          minInterval = subtractedYears;
          minResult.push(result);
        }
      }
    });

    return { minResult, maxResult };
  }

  async show(): Promise<any> {
    const findAllProducers = await this.ormRepository.find();

    const filterProducersAlreadyAwards = findAllProducers
      .filter((value) => value.winner === "yes")
      .map((value) => ({
        year: value.year,
        producers: value.producers,
      }));

    if (!filterProducersAlreadyAwards)
      throw new Error("There is not producers list");

    const { minResult, maxResult } = this.getYearsInterval(
      filterProducersAlreadyAwards
    );

    const orderMinResultByInterval = minResult.sort((a, b) => {
      if (a.interval > b.interval) {
        return 1;
      }

      if (a.interval < b.interval) {
        return -1;
      }
      return 0;
    });

    const orderMaxResultByInterval = maxResult.sort((a, b) => {
      if (a.interval > b.interval) {
        return 1;
      }
      if (a.interval < b.interval) {
        return -1;
      }
      return 0;
    });

    return {
      min: orderMinResultByInterval,
      max: orderMaxResultByInterval,
    };
  }
}
