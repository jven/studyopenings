import { StatisticsModel } from './statisticsmodel';

export class ZeroStatisticsModel implements StatisticsModel {
  getRightMoveCount(pgn: string): Promise<number> {
    return Promise.resolve(0);
  }

  getWrongMoveCount(pgn: string): Promise<number> {
    return Promise.resolve(0);
  }
}
