import { ParsedVariation } from "./pgnparser";
import { TreeModel } from "../../tree/treemodel";
import { assert } from "../../../../util/assert";

export class TreeModelPopulator {
  private treeModel_: TreeModel;
  private pendingOperations_: Operation[];

  constructor(mainLineVariation: ParsedVariation) {
    this.treeModel_ = new TreeModel();
    this.treeModel_.setRepertoireName('Imported repertoire');
    
    this.pendingOperations_ = [];
    if (mainLineVariation.moves.length) {
      this.pendingOperations_.push({
        startPgn: '',
        variation: mainLineVariation,
        moveIndex: 0
      });
    }
  }

  doIncrementalWork(): void {
    const operation = this.pendingOperations_.shift();
    if (!operation) {
      throw new Error('No more work!');
    }

    const node = operation.variation.moves[operation.moveIndex];
    this.treeModel_.addMove(operation.startPgn, node.move);

    const childPgn = this.treeModel_.getSelectedViewInfo().pgn;
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
}

interface Operation {
  startPgn: string,
  variation: ParsedVariation,
  moveIndex: number
}