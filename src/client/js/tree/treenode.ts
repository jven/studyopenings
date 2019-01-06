import { Color } from "../../../protocol/color";
import { FenNormalizer } from "./fennormalizer";
import { Move } from "../common/move";
import { ViewInfo } from "../common/viewinfo";
import { FenToPgnMap } from "./fentopgnmap";
import { PgnToNodeMap } from "./pgntonodemap";
import { RepertoireNode } from "../../../protocol/storage";
import { Transposition } from "../common/transposition";

export class TreeNode {
  private parent_: TreeNode | null;
  private position_: string;
  private pgn_: string;
  private numLegalMoves_: number;
  private colorToMove_: Color;
  private lastMove_: Move | null;
  private lastMoveString_: string;
  private lastMoveNumber_: number;
  private lastMoveColor_: Color;
  private lastMoveVerboseString_: string;
  private depth_: number;
  private children_: TreeNode[];

  constructor(
      parent: TreeNode | null,
      position: string,
      pgn: string,
      numLegalMoves: number,
      lastMove: Move | null,
      lastMoveString: string,
      depth: number) {
    this.parent_ = parent;
    this.position_ = position;
    this.pgn_ = pgn;
    this.numLegalMoves_ = numLegalMoves;
    this.colorToMove_ = depth % 2 == 0 ? Color.WHITE : Color.BLACK;
    this.lastMove_ = lastMove;
    this.lastMoveString_ = lastMoveString || '(start)';
    this.lastMoveNumber_ = Math.floor((depth + 1) / 2);
    this.lastMoveColor_ = depth % 2 == 1 ? Color.WHITE : Color.BLACK;
    this.lastMoveVerboseString_ = lastMoveString
        ? (this.lastMoveColor_ == Color.WHITE
            ? this.lastMoveNumber_ + '. ' + this.lastMoveString_
            : this.lastMoveNumber_ + '... ' + this.lastMoveString_)
        : '(start)';
    this.depth_ = depth;
    this.children_ = [];
  }

  pgn(): string {
    return this.pgn_;
  }

  addChild(
      position: string,
      pgn: string,
      numLegalMoves: number,
      lastMove: Move,
      lastMoveString: string): TreeNode {
    const child = new TreeNode(
      this,
      position,
      pgn,
      numLegalMoves,
      lastMove,
      lastMoveString,
      this.depth_ + 1);
    this.children_.push(child);
    return child;
  }

  removeChildPgn(pgnToRemove: string): void {
    for (var i = 0; i < this.children_.length; i++) {
      if (this.children_[i].pgn_ == pgnToRemove) {
        this.children_.splice(i, 1);
        return;
      }
    }
  }

  toViewInfo(
      selectedNode: TreeNode,
      pgnToNode: PgnToNodeMap,
      fenToPgn: FenToPgnMap,
      repertoireColor: Color): ViewInfo {
    const transposition = this.calculateTransposition_(
        pgnToNode, fenToPgn, repertoireColor);
    return {
      position: this.position_,
      pgn: this.pgn_,
      parentPgn: this.parent_ ? this.parent_.pgn() : null,
      numLegalMoves: this.numLegalMoves_,
      colorToMove: this.colorToMove_,
      lastMove: this.lastMove_,
      lastMoveString: this.lastMoveString_,
      lastMoveVerboseString: this.lastMoveVerboseString_,
      lastMovePly: this.depth_,
      lastMoveNumber: this.lastMoveNumber_,
      lastMoveColor: this.lastMoveColor_,
      numChildren: this.children_.length,
      childPgns: this.children_.map(c => c.pgn_),
      isSelected: this.pgn_ == selectedNode.pgn_,
      warnings: this.calculateWarnings_(repertoireColor, transposition),
      transposition: transposition
    };
  }

  parentOrSelf(): TreeNode {
    return this.parent_ ? this.parent_ : this;
  }

  firstChildOrSelf(): TreeNode {
    return this.children_.length ? this.children_[0] : this;
  }

  previousSiblingOrSelf(stopWithManyChildren: boolean): TreeNode {
    if (!this.parent_) {
      return this;
    }
    if (this.parent_.children_.length == 1) {
      return this.parent_.previousSiblingOrSelf(
          true /* stopWithManyChildren */);
    }
    if (stopWithManyChildren) {
      return this;
    }
    for (var i = 1; i < this.parent_.children_.length; i++) {
      if (this == this.parent_.children_[i]) {
        return this.parent_.children_[i - 1];
      }
    }
    return this.parent_;
  }

  nextSiblingOrSelf(stopWithManyChildren: boolean): TreeNode {
    if (this.parent_ && this.parent_.children_.length > 1) {
      for (var i = 0; i < this.parent_.children_.length - 1; i++) {
        if (this == this.parent_.children_[i]) {
          return this.parent_.children_[i + 1];
        }
      }
    }
    if (this.children_.length == 1) {
      return this.children_[0].nextSiblingOrSelf(
          true /* stopWithManyChildren */);
    }
    if (stopWithManyChildren) {
      return this;
    }
    return this.children_.length ? this.children_[0] : this;
  }

  traverseDepthFirstPreorder(
      callback: (v: ViewInfo) => void,
      selectedNode: TreeNode,
      pgnToNode: PgnToNodeMap,
      fenToPgn: FenToPgnMap,
      repertoireColor: Color): void {
    callback(this.toViewInfo(
        selectedNode, pgnToNode, fenToPgn, repertoireColor));
    this.children_.forEach(
        child => child.traverseDepthFirstPreorder(
            callback, selectedNode, pgnToNode, fenToPgn, repertoireColor));
  }

  traverseDepthFirstPostorder(
      callback: (v: ViewInfo) => void,
      selectedNode: TreeNode,
      pgnToNode: {},
      fenToPgn: {},
      repertoireColor: Color): void {
    this.children_.forEach(
        child => child.traverseDepthFirstPostorder(
            callback, selectedNode, pgnToNode, fenToPgn, repertoireColor));
    callback(this.toViewInfo(
        selectedNode, pgnToNode, fenToPgn, repertoireColor));
  }

  serializeForServer(): RepertoireNode {
    return {
      pgn: this.pgn_,
      fen: this.position_,
      nlm: this.numLegalMoves_,
      ctm: this.colorToMove_ == Color.WHITE ? 'w' : 'b',
      lmf: this.lastMove_ ? this.lastMove_.fromSquare : '',
      lmt: this.lastMove_ ? this.lastMove_.toSquare : '',
      lms: this.lastMoveString_ || '',
      c: this.children_.map(c => c.serializeForServer())
    };
  }

  calculateWarnings_(
      repertoireColor: Color,
      transposition: Transposition | null): string[] {
    const warnings = [];
    const numChildren = this.children_.length;
    const displayColor = repertoireColor == Color.WHITE ? 'White' : 'Black';
    if (transposition && numChildren > 0) {
      if (transposition.isRepetition) {
        warnings.push(transposition.message
            + '<p>Lines containing repetitions must end on the first repeated '
            + 'position.<p>To fix, delete all moves after <b>'
            + this.lastMoveVerboseString_
            + '</b>.');
      } else {
        warnings.push(transposition.message
            + '<p>Continuations from this position should be added to that '
            + 'line instead.<p>To fix, delete all moves after <b>'
            + this.lastMoveVerboseString_
            + '</b>.');
      }
    }
    if (this.colorToMove_ == repertoireColor) {
      if (!transposition && !numChildren) {
        warnings.push(displayColor
            + ' has no reply to <b>'
            + this.lastMoveVerboseString_
            + '</b>.<p>To fix, add a move for '
            + displayColor
            + ' after <b>'
            + this.lastMoveVerboseString_
            + '</b> or delete this move.');
      }
      if (!transposition && numChildren > 1) {
        warnings.push('There are multiple moves for '
            + displayColor
            + ' after <b>'
            + this.lastMoveVerboseString_
            + '</b> ('
            + (this.children_.length > 2 ? 'e.g. ' : '')
            + '<b>'
            + this.children_[0].lastMoveVerboseString_
            + '</b> and <b>'
            + this.children_[1].lastMoveVerboseString_
            + '</b>).<p>To fix, choose at most one move for '
            + displayColor
            + ' from this position and delete all other moves.');
      }
    }
    return warnings;
  }

  calculateTransposition_(
      pgnToNode: PgnToNodeMap,
      fenToPgn: FenToPgnMap,
      repertoireColor: Color): Transposition | null {
    const normalizedFen = FenNormalizer.normalize(
        this.position_, this.numLegalMoves_);
    if (!fenToPgn[normalizedFen]
        || fenToPgn[normalizedFen].length < 2
        || fenToPgn[normalizedFen][0] == this.pgn_) {
      // This is a unique position or the first occurrence of it.
      return null;
    }

    for (var i = 0; i < fenToPgn[normalizedFen].length; i++) {
      const repetitionPgn = fenToPgn[normalizedFen][i];
      const repetitionNode = pgnToNode[repetitionPgn];
      if (this.pgn_ != repetitionPgn
          && this.pgn_.startsWith(repetitionPgn)
          && repetitionNode) {
        // This is a repetition.
        const repetitionMessage = '<b>' + this.lastMoveVerboseString_
            + '</b> is a repetition of the position after <b>'
            + repetitionNode.lastMoveVerboseString_
            + '</b>.';
        return {
          pgn: repetitionPgn,
          isRepetition: true,
          title: 'Repetition',
          message: repetitionMessage
        };
      }
    }

    const transpositionPgn = fenToPgn[normalizedFen][0];
    const transpositionMessage = '<b>' + this.lastMoveVerboseString_
        + '</b> transposes to: <p><b>'
        + (transpositionPgn || '(start)')
        + '</b>.';
    return {
      pgn: transpositionPgn,
      isRepetition: false,
      title: 'Transposition',
      message: transpositionMessage
    };
  }
}