interface IPropsProducersAwards {
  producer: string;
  interval: number;
  previousWin: number;
  followingWin: number;
}

export interface IResponse {
  min: IPropsProducersAwards[];
  max: IPropsProducersAwards[];
}

export default interface IProducersAwardsRepository {
  show(): Promise<IResponse>;
}
