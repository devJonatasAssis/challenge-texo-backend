import { ProducersAwardsService } from "../../../../../modules/movies/services/ProducersAwardsService";
import { Request, Response } from "express";
import { container } from "tsyringe";

export default class ProducersAwardsController {
  public async show(request: Request, response: Response): Promise<Response> {
    const showProducersAwards = container.resolve(ProducersAwardsService);

    const producersAwards = await showProducersAwards.execute();

    return response.status(201).json(producersAwards);
  }
}
