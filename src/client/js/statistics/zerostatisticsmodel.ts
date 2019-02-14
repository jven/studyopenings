import { StatisticsModel } from './statisticsmodel';

export class ZeroStatisticsModel implements StatisticsModel {
  getRepertoireFinishLineCount(): Promise<number> {
    return Promise.resolve(0);
  }

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
