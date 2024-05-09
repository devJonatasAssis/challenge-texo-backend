import { ProducersAwardsRepository } from '../../modules/movies/infra/repositories/ProducersAwardsRepository';
import IProducersAwardsRepository from '../../modules/movies/repositories/IProducersAwardsRepository';
import { container } from 'tsyringe';

container.registerSingleton<IProducersAwardsRepository>(
  'ProducersAwardsRepository',
  ProducersAwardsRepository,
);
