import { CumulatedStatistic } from '../../../protocol/statistic/cumulatedstatistic';
import { ServerWrapper } from '../server/serverwrapper';
import { StatisticsModel } from './statisticsmodel';

export class ServerStatisticsModel implements StatisticsModel {
  private repertoireFinishLineCount_: Promise<number>;
  private repertoireRightMoveCount_: Promise<number>;
  private repertoireWrongMoveCount_: Promise<number>;
  private rightMoveCounts_: Promise<Map<string, number>>;
  private wrongMoveCounts_: Promise<Map<string, number>>;

  constructor(
      server: ServerWrapper,
      repertoireId: string) {
    const cumulatedStatistics = server.loadCumulatedStatistics(repertoireId);
    const finishLineCounts = this.mapFromCumulatedStatistics_(
        cumulatedStatistics, cs => cs.finishLineCount);
    this.rightMoveCounts_ = this.mapFromCumulatedStatistics_(
      cumulatedStatistics, cs => cs.rightMoveCount);
    this.wrongMoveCounts_ = this.mapFromCumulatedStatistics_(
        cumulatedStatistics, cs => cs.wrongMoveCount);

    this.repertoireFinishLineCount_ = this.sumValues_(finishLineCounts);
    this.repertoireRightMoveCount_ = this.sumValues_(this.rightMoveCounts_);
    this.repertoireWrongMoveCount_ = this.sumValues_(this.wrongMoveCounts_);
  }

  private mapFromCumulatedStatistics_<T>(
      cumulatedStatistics: Promise<CumulatedStatistic[]>,
      mapFn: (cs: CumulatedStatistic) => T): Promise<Map<string, T>> {
    return cumulatedStatistics
        .then(csList => {
          const map = new Map();
          csList.forEach(cs => map.set(cs.pgn, mapFn(cs)));
          return map;
        });
  }

  private sumValues_(m: Promise<Map<string, number>>): Promise<number> {
    return m.then(map => Array.from(map.values()).reduce((a, b) => a + b, 0));
  }

  getRepertoireFinishLineCount(): Promise<number> {
    return this.repertoireFinishLineCount_;
  }

  getRepertoireRightMoveCount(): Promise<number> {
    return this.repertoireRightMoveCount_;
  }

  getRepertoireWrongMoveCount(): Promise<number> {
    return this.repertoireWrongMoveCount_;
  }

  getRightMoveCount(pgn: string): Promise<number> {
    return this.rightMoveCounts_.then(map => map.get(pgn) || 0);
  }

  getWrongMoveCount(pgn: string): Promise<number> {
    return this.wrongMoveCounts_.then(map => map.get(pgn) || 0);
  }
}
