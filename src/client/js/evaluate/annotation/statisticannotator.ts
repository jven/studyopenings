import { Color } from '../../../../protocol/color';
import { Annotator } from '../../annotation/annotator';
import { StatisticsModel } from '../../statistics/statisticsmodel';
import { FenToPgnMap } from '../../tree/fentopgnmap';
import { PgnToNodeMap } from '../../tree/pgntonodemap';
import { TreeNode } from '../../tree/treenode';
import { StatisticAnnotation } from './statisticannotation';

export class StatisticAnnotator implements Annotator<StatisticAnnotation> {
  private statisticsModel_: StatisticsModel;

  constructor(statisticsModel: StatisticsModel) {
    this.statisticsModel_ = statisticsModel;
  }

  annotate(
      node: TreeNode,
      repertoireColor: Color,
      pgnToNode: PgnToNodeMap,
      fenToPgn: FenToPgnMap): Promise<StatisticAnnotation> {
    return Promise
        .all([
          this.statisticsModel_.getRightMoveCount(node.pgn),
          this.statisticsModel_.getWrongMoveCount(node.pgn)
        ])
        .then(counts => {
          return {
            rightMoveCount: counts[0],
            wrongMoveCount: counts[1]
          };
        });
  }
}
