import { CumulatedStatistic } from '../../../protocol/statistic/cumulatedstatistic';
import { ServerWrapper } from '../server/serverwrapper';
import { StatisticsModel } from './statisticsmodel';

export class ServerStatisticsModel implements StatisticsModel {
  private rightMoveCounts_: Promise<Map<string, number>>;
  private wrongMoveCounts_: Promise<Map<string, number>>;

  constructor(
      server: ServerWrapper,
      repertoireId: string) {
    const cumulatedStatistics = server.loadCumulatedStatistics(repertoireId);
    this.rightMoveCounts_ = this.mapFromCumulatedStatistics_(
      cumulatedStatistics, cs => cs.rightMoveCount);
    this.wrongMoveCounts_ = this.mapFromCumulatedStatistics_(
        cumulatedStatistics, cs => cs.wrongMoveCount);
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

  getRightMoveCount(pgn: string): Promise<number> {
    return this.rightMoveCounts_.then(map => map.get(pgn) || 0);
  }

  getWrongMoveCount(pgn: string): Promise<number> {
    return this.wrongMoveCounts_.then(map => map.get(pgn) || 0);
  }
}
