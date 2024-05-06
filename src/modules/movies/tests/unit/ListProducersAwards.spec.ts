import "reflect-metadata";

import FakeProducersAwardsRepository from "../../repositories/fake/FakeProducersAwardsRepository";
import { ProducersAwardsService } from "../../services/ProducersAwardsService";
import { mockResultExpectedProducersAwards } from "../../repositories/fake/mock/mockResultExpectedProducersAwards";

describe("ListProducersAwards", () => {
  let fakeProducersAwardsRepository: FakeProducersAwardsRepository;
  let listProducersAwards: ProducersAwardsService;

  beforeEach(() => {
    fakeProducersAwardsRepository = new FakeProducersAwardsRepository();
    listProducersAwards = new ProducersAwardsService(
      fakeProducersAwardsRepository
    );
  });

  it("The producer with the longest interval between two consecutive awards must return, and the one who obtained two awards the fastest", async () => {
    const result = await listProducersAwards.execute();

    expect(result).toEqual(
      expect.objectContaining(mockResultExpectedProducersAwards)
    );
  });
});
