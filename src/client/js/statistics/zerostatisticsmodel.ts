import { StatisticsModel } from './statisticsmodel';

export class ZeroStatisticsModel implements StatisticsModel {
  getRepertoireRightMoveCount(): Promise<number> {
    return Promise.resolve(0);
  }

  getRepertoireWrongMoveCount(): Promise<number> {
    return Promise.resolve(0);
  }

  getRightMoveCount(): Promise<number> {
    return Promise.resolve(0);
  }

  getWrongMoveCount(): Promise<number> {
    return Promise.resolve(0);
  }
}
