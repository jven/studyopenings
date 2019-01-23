import { StatisticRecorder } from './statisticrecorder';

export class NoOpStatisticRecorder implements StatisticRecorder {
  recordRightMove(): void {}

  recordWrongMove(): void {}
}
