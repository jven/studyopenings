import { assert } from '../../../../util/assert';
import { getUtcDate, getUtcTime } from '../../../../util/datetime';
import { NullAnnotator } from '../../annotate/nullannotator';
import { AddMoveFailureReason } from '../../tree/addmoveresult';
import { TreeModel } from '../../tree/treemodel';
import { ConverterStatus } from './converterstatus';
import { ParsedVariation } from './pgnparser';

export class TreeModelPopulator {
  private status_: ConverterStatus;
  private treeModel_: TreeModel;
  private pendingOperations_: Operation[];
  private populatedMoves_: number;
  private totalMoves_: number;

  constructor(
      mainLineVariations: ParsedVariation[],
      status: ConverterStatus) {
    this.status_ = status;

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
    const result = this.treeModel_.addMove(operation.startPgn, node.move);
    if (!result.success) {
      const startPgnString = operation.startPgn || '(start)';
      this.handleFailureReason_(
          assert(result.failureReason), startPgnString, node.move);
      return;
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

  private handleFailureReason_(
      reason: AddMoveFailureReason,
      startPgn: string,
      moveString: string): void {
    switch (reason) {
      case AddMoveFailureReason.ILLEGAL_MOVE:
        this.status_.addError(
            `${moveString} is not a legal move after ${startPgn}.`);
        break;
      case AddMoveFailureReason.EXCEEDED_MAXIMUM_LINE_DEPTH:
        this.status_.markLongLineTruncated();
        break;
      default:
        throw new Error('Unknown failure reason.');
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
