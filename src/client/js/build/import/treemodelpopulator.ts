import { getUtcDate, getUtcTime } from '../../../../util/datetime';
import { NullAnnotator } from '../../annotate/nullannotator';
import { TreeModel } from '../../tree/treemodel';
import { ParsedVariation } from './pgnparser';

export class TreeModelPopulator {
  private treeModel_: TreeModel;
  private pendingOperations_: Operation[];
  private populatedMoves_: number;
  private totalMoves_: number;

  constructor(mainLineVariations: ParsedVariation[]) {
    const now = new Date();
    this.treeModel_ = new TreeModel();
    this.treeModel_.setRepertoireName(
        `PGN imported on ${getUtcDate(now)} ${getUtcTime(now)}`);
    
    this.pendingOperations_ = [];
    mainLineVariations.forEach(v => {
      if (v.moves.length) {
        this.pendingOperations_.push({
          startPgn: '',
          variation: v,
          moveIndex: 0
        });
      }
    });

    this.populatedMoves_ = 0;
    this.totalMoves_ = mainLineVariations
        .map(v => TreeModelPopulator.countTotalMoves_(v))
        .reduce((x, y) => x + y);
  }

  numPopulatedMoves(): number {
    return this.populatedMoves_;
  }

  numTotalMoves(): number {
    return this.totalMoves_;
  }

  doIncrementalWork(): void {
    const operation = this.pendingOperations_.shift();
    if (!operation) {
      throw new Error('No more work!');
    }

    const node = operation.variation.moves[operation.moveIndex];
    const isLegalMove = this.treeModel_.addMove(operation.startPgn, node.move);
    if (!isLegalMove) {
      const startPgnString = operation.startPgn || '(start)';
      throw new Error(
          `${node.move} is not a legal move after ${startPgnString}.`);
    }
    this.populatedMoves_++;

    const childPgn = this.treeModel_.getSelectedViewInfo(
        NullAnnotator.INSTANCE).pgn;
    if (operation.moveIndex < operation.variation.moves.length - 1) {
      this.pendingOperations_.push({
        startPgn: childPgn,
        variation: operation.variation,
        moveIndex: operation.moveIndex + 1
      });
    }

    if (node.ravs) {
      for (let i = 0; i < node.ravs.length; i++) {
        this.pendingOperations_.push({
          startPgn: operation.startPgn,
          variation: node.ravs[i],
          moveIndex: 0
        });
      }
    }
  }

  isComplete(): boolean {
    return !this.pendingOperations_.length;
  }

  getPopulatedTreeModel(): TreeModel {
    if (!this.isComplete()) {
      throw new Error('Not complete yet!');
    }

    return this.treeModel_;
  }

  private static countTotalMoves_(variation: ParsedVariation): number {
    let totalMoves = variation.moves.length;
    variation.moves.forEach(m => {
      if (m.ravs) {
        m.ravs.forEach(v => {
          totalMoves += TreeModelPopulator.countTotalMoves_(v);
        });
      }
    });
    return totalMoves;
  }
}

interface Operation {
  startPgn: string,
  variation: ParsedVariation,
  moveIndex: number
}