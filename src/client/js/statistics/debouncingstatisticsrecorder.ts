import { Statistic } from '../../../protocol/statistic/statistic';
import { StatisticType } from '../../../protocol/statistic/statistictype';
import { Debouncer } from '../common/debouncer';
import { PickerController } from '../picker/pickercontroller';
import { ServerWrapper } from '../server/serverwrapper';
import { StatisticRecorder } from './statisticrecorder';

export class DebouncingStatisticRecorder implements StatisticRecorder {
  private pickerController_: PickerController;
  private server_: ServerWrapper;
  private debouncer_: Debouncer;
  private statisticsToSend_: Statistic[];

  constructor(
      pickerController: PickerController,
      server: ServerWrapper,
      debounceIntervalMs: number) {
    this.pickerController_ = pickerController;
    this.server_ = server;
    this.debouncer_ = new Debouncer(
        () => this.sendToServer_(), debounceIntervalMs);

    this.statisticsToSend_ = [];
  }

  recordRightMove(pgn: string): void {
    this.recordStatistic_(pgn, StatisticType.RIGHT_MOVE);
  }

  recordWrongMove(pgn: string): void {
    this.recordStatistic_(pgn, StatisticType.WRONG_MOVE);
  }

  private recordStatistic_(pgn: string, statisticType: StatisticType): void {
    const repertoireId = this.pickerController_.getSelectedMetadataId();
    this.statisticsToSend_.push({repertoireId, pgn, statisticType});
    this.debouncer_.fire();
  }

  private sendToServer_(): void {
    this.server_.recordStatistics(this.statisticsToSend_);
    this.statisticsToSend_ = [];
  }
}
