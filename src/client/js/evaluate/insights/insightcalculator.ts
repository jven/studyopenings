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
    let lineCount = 0;
    let positionCount = 0;
    this.treeModel_.traverseDepthFirst(viewInfo => {
      positionCount++;
      if (!viewInfo.numChildren) {
        lineCount++;
      }
    }, NullAnnotator.INSTANCE);

    return [
      'In this repertoire...',
      {
        title: 'Number of lines',
        value: Promise.resolve(lineCount),
        color: InsightColor.GRAY
      },
      {
        title: 'Number of positions',
        value: Promise.resolve(positionCount),
        color: InsightColor.GRAY
      },
      {
        title: 'Times you finished studying a line',
        value: this.statisticsModel_.getRepertoireFinishLineCount(),
        color: InsightColor.YELLOW
      },
      {
        title: 'Times you played a correct move while studying',
        value: this.statisticsModel_.getRepertoireRightMoveCount(),
        color: InsightColor.GREEN
      },
      {
        title: 'Times you played a wrong move while studying',
        value: this.statisticsModel_.getRepertoireWrongMoveCount(),
        color: InsightColor.RED
      },
      'For the selected position...',
      {
        title: 'Times you played the correct move',
        value: this.statisticsModel_.getRightMoveCount(
            this.treeModel_.getSelectedViewInfo(NullAnnotator.INSTANCE).pgn),
        color: InsightColor.GREEN
      },
      {
        title: 'Times you played the wrong move',
        value: this.statisticsModel_.getWrongMoveCount(
            this.treeModel_.getSelectedViewInfo(NullAnnotator.INSTANCE).pgn),
        color: InsightColor.RED
      }
    ];
  }
}
