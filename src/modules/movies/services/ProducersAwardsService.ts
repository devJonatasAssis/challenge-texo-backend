import { inject, injectable } from "tsyringe";
import IProducersAwardsRepository from "../typeorm/repositories/IProducersAwardsRepository";

@injectable()
export class ProducersAwardsService {
  constructor(
    @inject("ProducersAwardsRepository")
    private producersAwardsRepository: IProducersAwardsRepository
  ) {}

  public async execute() {
    const awards = await this.producersAwardsRepository.show();

    if (!awards) {
      throw new Error("No data found");
    }

    return awards;
  }
}
