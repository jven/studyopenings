import { Color } from '../../../protocol/color';
import { Line } from './line';
import { RepertoireModel } from '../common/repertoiremodel';
import { ViewInfo } from '../common/viewinfo';

declare type PgnToViewInfo_ = {[pgn: string]: ViewInfo};
declare type PgnToDescendentCount_ = {[pgn: string]: number};

export class Repertoire {
  private color_: Color;
  private pgnToViewInfo_: PgnToViewInfo_;
  private pgnToDescendentCount_: PgnToDescendentCount_;

  constructor(
      color: Color,
      pgnToViewInfo: PgnToViewInfo_,
      pgnToDescendentCount: PgnToDescendentCount_) {
    this.color_ = color;
    this.pgnToViewInfo_ = pgnToViewInfo;
    this.pgnToDescendentCount_ = pgnToDescendentCount;
  }

  getNextLine(): Line | null {
    var currentViewInfo = this.pgnToViewInfo_[''];
    if (!currentViewInfo || !currentViewInfo.numChildren) {
      return null;
    }

    const moves = [];
    const visitedPgns: {[pgn: string]: boolean} = {};
    while (currentViewInfo.transposition || currentViewInfo.numChildren) {
      if (visitedPgns[currentViewInfo.pgn]) {
        throw new Error('Infinite loop when computing the next line.');
      }
      visitedPgns[currentViewInfo.pgn] = true;
      if (currentViewInfo.transposition) {
        if (currentViewInfo.transposition.isRepetition) {
          // End lines on repeated positions, ignoring any children.
          break;
        }
        currentViewInfo
            = this.pgnToViewInfo_[currentViewInfo.transposition.pgn];
        continue;
      }
      currentViewInfo
          = this.pgnToViewInfo_[this.randomChildPgn_(currentViewInfo)];
      moves.push(currentViewInfo.lastMoveString);
    }
    return Line.fromMoveStringsForInitialPosition(moves, this.color_);
  }

  private randomChildPgn_(viewInfo: ViewInfo): string {
    const childDescendents = viewInfo.childPgns.map(childPgn => {
      if (!this.pgnToDescendentCount_[childPgn]) {
        throw new Error('Unknown descendent count for child PGN: ' + childPgn);
      }
      return this.pgnToDescendentCount_[childPgn];
    });
    const totalDescendents = childDescendents.reduce((a, b) => a + b);
    const r = Math.floor(Math.random() * totalDescendents);
    var s = 0;
    for (var i = 0; i < childDescendents.length; i++) {
      s += childDescendents[i];
      if (r < s) {
        return viewInfo.childPgns[i];
      }
    }

    throw new Error('Could not pick child PGN.');
  }

  static fromModel(repertoireModel: RepertoireModel): Repertoire {
    if (repertoireModel.isEmpty()) {
      return new Repertoire(Color.WHITE, {}, {});
    }

    const pgnToViewInfo: PgnToViewInfo_ = {};
    const pgnToDescendentCount: PgnToDescendentCount_ = {};

    repertoireModel.traverseDepthFirstPostorder(viewInfo => {
      pgnToViewInfo[viewInfo.pgn] = viewInfo;
      if (viewInfo.transposition) {
        if (viewInfo.transposition.isRepetition) {
          // Ignore children of repeated positions.
          pgnToDescendentCount[viewInfo.pgn] = 1;
          return;
        }
        const transpositionPgn = viewInfo.transposition.pgn;
        if (!pgnToDescendentCount[transpositionPgn]) {
          throw new Error('Transposition visited before original.');
        }
        pgnToDescendentCount[viewInfo.pgn]
            = pgnToDescendentCount[transpositionPgn];
        return;
      }
      if (!viewInfo.numChildren) {
        pgnToDescendentCount[viewInfo.pgn] = 1;
        return;
      }
      var countSum = 0;
      viewInfo.childPgns.forEach(childPgn => {
        const childCount = pgnToDescendentCount[childPgn];
        if (!childCount) {
          throw new Error('Parent visited before child.');
        }
        countSum += childCount;
      });
      pgnToDescendentCount[viewInfo.pgn] = countSum;
    });
    return new Repertoire(
        repertoireModel.getRepertoireColor(),
        pgnToViewInfo,
        pgnToDescendentCount);
  }
}
