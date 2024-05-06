import {
  ProducerResponse,
  ProducersProps,
} from "@modules/movies/infra/typeorm/repositories/ProducersAwardsRepository";
import IProducersAwardsRepository, {
  IResponse,
} from "../IProducersAwardsRepository";
import { mockListProducersAwards } from "./mock/mockListProducersAwards";

class FakeProducersAwardsRepository implements IProducersAwardsRepository {
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
    const filterProducersAlreadyAwards = mockListProducersAwards
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

export default FakeProducersAwardsRepository;
