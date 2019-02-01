import { StatisticsModel } from './statisticsmodel';
import { ZeroStatisticsModel } from './zerostatisticsmodel';

export class DelegatingStatisticsModel implements StatisticsModel {
  private delegate_: StatisticsModel;

  constructor() {
    this.delegate_ = new ZeroStatisticsModel();
  }

  setDelegate(delegate: StatisticsModel): void {
    this.delegate_ = delegate;
  }

  getRepertoireRightMoveCount(): Promise<number> {
    return this.delegate_.getRepertoireRightMoveCount();
  }

  getRepertoireWrongMoveCount(): Promise<number> {
    return this.delegate_.getRepertoireWrongMoveCount();
  }

  getRightMoveCount(pgn: string): Promise<number> {
    return this.delegate_.getRightMoveCount(pgn);
  }

  getWrongMoveCount(pgn: string): Promise<number> {
    return this.delegate_.getWrongMoveCount(pgn);
  }
}
