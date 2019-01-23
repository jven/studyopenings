import { Statistic } from '../../../protocol/statistic/statistic';
import { StatisticType } from '../../../protocol/statistic/statistictype';
import { Debouncer } from '../common/debouncer';
import { ServerWrapper } from '../server/serverwrapper';
import { StatisticRecorder } from './statisticrecorder';

export class DebouncingStatisticRecorder implements StatisticRecorder {
  private server_: ServerWrapper;
  private debouncer_: Debouncer;
  private statisticsToSend_: Statistic[];

  constructor(
      server: ServerWrapper,
      debounceIntervalMs: number) {
    this.server_ = server;
    this.debouncer_ = new Debouncer(
        () => this.sendToServer_(), debounceIntervalMs);

    this.statisticsToSend_ = [];
  }

  recordRightMove(repertoireId: string, pgn: string): void {
    this.recordStatistic_(repertoireId, pgn, StatisticType.RIGHT_MOVE);
  }

  recordWrongMove(repertoireId: string, pgn: string): void {
    this.recordStatistic_(repertoireId, pgn, StatisticType.WRONG_MOVE);
  }

  private recordStatistic_(
      repertoireId: string, pgn: string, statisticType: StatisticType): void {
    this.statisticsToSend_.push({repertoireId, pgn, statisticType});
    this.debouncer_.fire();
  }

  private sendToServer_(): void {
    this.server_.recordStatistics(this.statisticsToSend_);
    this.statisticsToSend_ = [];
  }
}
