import { NullAnnotator } from '../../annotation/nullannotator';
import { StatisticsModel } from '../../statistics/statisticsmodel';
import { TreeModel } from '../../tree/treemodel';
import { Insight } from './insight';

enum InsightColor {
  GRAY = '#dfdfdf',
  YELLOW = '#ffd700',
  GREEN = 'rgb(155, 199, 0)',
  RED = 'red'
}

export class InsightCalculator {
  private treeModel_: TreeModel;
  private statisticsModel_: StatisticsModel;

  constructor(
      treeModel: TreeModel,
      statisticsModel: StatisticsModel) {
    this.treeModel_ = treeModel;
    this.statisticsModel_ = statisticsModel;
  }

  calculate(): (Insight | string)[] {
    return [
      'In this repertoire...',
      {
        title: 'Number of lines',
        value: Promise.resolve('12'),
        color: InsightColor.GRAY
      },
      {
        title: 'Number of positions',
        value: Promise.resolve('35'),
        color: InsightColor.GRAY
      },
      {
        title: 'Times you completed studying a line',
        value: Promise.resolve('142'),
        color: InsightColor.YELLOW
      },
      {
        title: 'Times you played a correct move while studying',
        value: Promise.resolve('677'),
        color: InsightColor.GREEN
      },
      {
        title: 'Times you played a wrong move while studying',
        value: Promise.resolve('90'),
        color: InsightColor.RED
      },
      'For the selected position...',
      {
        title: 'Times you played the correct move',
        value: this.statisticsModel_.getRightMoveCount(
            this.treeModel_.getSelectedViewInfo(NullAnnotator.INSTANCE).pgn)
                .then(v => `${v}`),
        color: InsightColor.GREEN
      },
      {
        title: 'Times you played the wrong move',
        value: this.statisticsModel_.getWrongMoveCount(
            this.treeModel_.getSelectedViewInfo(NullAnnotator.INSTANCE).pgn)
                .then(v => `${v}`),
        color: InsightColor.RED
      }
    ];
  }
}
