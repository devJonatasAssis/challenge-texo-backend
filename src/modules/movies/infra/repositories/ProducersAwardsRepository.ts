import IProducersAwardsRepository from '../../repositories/IProducersAwardsRepository';
import { Movie } from '../../schema';

export interface ProducersProps {
  producers: string;
  year: number;
}

export interface ProducerResponse {
  producer: string;
  interval: number;
  previousWin: number;
  followingWin: number;
}

export class ProducersAwardsRepository implements IProducersAwardsRepository {
  private getYearsInterval(producers: any) {
    let maxInterval: number | undefined;
    let minInterval: number | undefined;

    let minResult: ProducerResponse[] = [];
    let maxResult: ProducerResponse[] = [];

    let resultProducers: any[] = [];

    producers.forEach((items: ProducersProps) => {
      const producersSplit = items.producers.split(', ');

      const listProducers = producersSplit.map((item: any) => {
        return {
          producer: item.split(' and '),
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
      },
    );

    const resultProduceAwards = Object.keys(groupProducersAwardsYears).map(
      item => {
        return {
          producer: item,
          years: groupProducersAwardsYears[item],
        };
      },
    );

    resultProduceAwards.forEach(({ producer, years }, index) => {
      if (index > 1 && years.length === 2) {
        const subtractedYears = Number(years[1]) - Number(years[0]);

        const result: any = {
          producer,
          interval: subtractedYears,
          previousWin: Number(years[0]),
          followingWin: Number(years[1]),
        };

        if (!maxInterval && !minInterval) {
          maxInterval = subtractedYears;
          minInterval = subtractedYears;

          maxResult = result;
          minResult = result;
        }

        if (maxInterval && maxInterval < subtractedYears) {
          maxInterval = subtractedYears;
          maxResult = result;
        }

        if (minInterval && minInterval > subtractedYears) {
          minInterval = subtractedYears;
          minResult = result;
        }
      }
    });

    return { minResult, maxResult };
  }

  async show(): Promise<any> {
    const findAllProducers = await Movie.find();

    const filterProducersAlreadyAwards = findAllProducers
      .filter(value => value.winner === 'yes')
      .map(value => ({
        year: value.year,
        producers: value.producers,
      }));

    if (!filterProducersAlreadyAwards)
      throw new Error('There is not producers list');

    const { minResult, maxResult } = this.getYearsInterval(
      filterProducersAlreadyAwards,
    );

    return {
      min: [minResult],
      max: [maxResult],
    };
  }
}
