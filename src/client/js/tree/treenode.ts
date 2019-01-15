import { Color } from '../../../protocol/color';
import { FenToPgnMap } from './fentopgnmap';
import { Move } from '../common/move';
import { PgnToNodeMap } from './pgntonodemap';
import { RepertoireNode } from '../../../protocol/storage';
import { ViewInfo } from '../common/viewinfo';
import { Annotator } from '../annotate/annotator';

export class TreeNode {
  public parent: TreeNode | null;
  public fen: string;
  public pgn: string;
  public numLegalMoves: number;
  public colorToMove: Color;
  public lastMove: Move | null;
  public lastMoveString: string;
  public lastMoveNumber: number;
  public lastMoveColor: Color;
  public lastMoveVerboseString: string;
  public depth: number;
  public children: TreeNode[];

  constructor(
      parent: TreeNode | null,
      fen: string,
      pgn: string,
      numLegalMoves: number,
      lastMove: Move | null,
      lastMoveString: string,
      depth: number) {
    this.parent = parent;
    this.fen = fen;
    this.pgn = pgn;
    this.numLegalMoves = numLegalMoves;
    this.colorToMove = depth % 2 == 0 ? Color.WHITE : Color.BLACK;
    this.lastMove = lastMove;
    this.lastMoveString = lastMoveString || '(start)';
    this.lastMoveNumber = Math.floor((depth + 1) / 2);
    this.lastMoveColor = depth % 2 == 1 ? Color.WHITE : Color.BLACK;
    this.lastMoveVerboseString = lastMoveString
        ? (this.lastMoveColor == Color.WHITE
            ? this.lastMoveNumber + '. ' + this.lastMoveString
            : this.lastMoveNumber + '... ' + this.lastMoveString)
        : '(start)';
    this.depth = depth;
    this.children = [];
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
        this.depth + 1);
    this.children.push(child);
    return child;
  }

  removeChildPgn(pgnToRemove: string): void {
    for (var i = 0; i < this.children.length; i++) {
      if (this.children[i].pgn == pgnToRemove) {
        this.children.splice(i, 1);
        return;
      }
    }
  }

  toViewInfo(
      selectedNode: TreeNode,
      pgnToNode: PgnToNodeMap,
      fenToPgn: FenToPgnMap,
      repertoireColor: Color,
      annotator: Annotator): ViewInfo {
    return {
      position: this.fen,
      pgn: this.pgn,
      parentPgn: this.parent ? this.parent.pgn : null,
      numLegalMoves: this.numLegalMoves,
      colorToMove: this.colorToMove,
      lastMove: this.lastMove,
      lastMoveString: this.lastMoveString,
      lastMoveVerboseString: this.lastMoveVerboseString,
      lastMovePly: this.depth,
      lastMoveNumber: this.lastMoveNumber,
      lastMoveColor: this.lastMoveColor,
      numChildren: this.children.length,
      childPgns: this.children.map(c => c.pgn),
      isSelected: this.pgn == selectedNode.pgn,
      annotation: annotator.annotate(this, repertoireColor, pgnToNode, fenToPgn)
    };
  }

  parentOrSelf(): TreeNode {
    return this.parent ? this.parent : this;
  }

  firstChildOrSelf(): TreeNode {
    return this.children.length ? this.children[0] : this;
  }

  previousSiblingOrSelf(stopWithManyChildren: boolean): TreeNode {
    if (!this.parent) {
      return this;
    }
    if (this.parent.children.length == 1) {
      return this.parent.previousSiblingOrSelf(
          true /* stopWithManyChildren */);
    }
    if (stopWithManyChildren) {
      return this;
    }
    for (var i = 1; i < this.parent.children.length; i++) {
      if (this == this.parent.children[i]) {
        return this.parent.children[i - 1];
      }
    }
    return this.parent;
  }

  nextSiblingOrSelf(stopWithManyChildren: boolean): TreeNode {
    if (this.parent && this.parent.children.length > 1) {
      for (var i = 0; i < this.parent.children.length - 1; i++) {
        if (this == this.parent.children[i]) {
          return this.parent.children[i + 1];
        }
      }
    }
    if (this.children.length == 1) {
      return this.children[0].nextSiblingOrSelf(
          true /* stopWithManyChildren */);
    }
    if (stopWithManyChildren) {
      return this;
    }
    return this.children.length ? this.children[0] : this;
  }

  traverseDepthFirst(
      callback: (v: ViewInfo) => void,
      selectedNode: TreeNode,
      pgnToNode: PgnToNodeMap,
      fenToPgn: FenToPgnMap,
      repertoireColor: Color,
      annotator: Annotator): void {
    callback(this.toViewInfo(
        selectedNode, pgnToNode, fenToPgn, repertoireColor, annotator));
    this.children.forEach(
        child => child.traverseDepthFirst(
            callback,
            selectedNode,
            pgnToNode,
            fenToPgn,
            repertoireColor,
            annotator));
  }

  exportChildrenToPgn(forceFirstChildVerbose: boolean): string {
    if (!this.children.length) {
      return '';
    }

    const firstChild = this.children[0];
    let ans = forceFirstChildVerbose || firstChild.lastMoveColor == Color.WHITE
        ? firstChild.lastMoveVerboseString
        : firstChild.lastMoveString;
        
    for (let i = 1; i < this.children.length; i++) {
      const otherChild = this.children[i];
      const otherChildContinuation = otherChild.exportChildrenToPgn(false);

      ans += ' (' + otherChild.lastMoveVerboseString;
      if (otherChildContinuation) {
        ans += ' ' + otherChildContinuation;
      }
      ans += ')';
    }
        
    const firstChildForceVerbose = this.children.length > 1;
    const firstChildContinuation = firstChild.exportChildrenToPgn(
        firstChildForceVerbose);
    if (firstChildContinuation) {
      ans += ' ' + firstChildContinuation;
    }

    return ans;
  }

  serializeAsRepertoireNode(): RepertoireNode {
    return {
      pgn: this.pgn,
      fen: this.fen,
      nlm: this.numLegalMoves,
      ctm: this.colorToMove == Color.WHITE ? 'w' : 'b',
      lmf: this.lastMove ? this.lastMove.fromSquare : '',
      lmt: this.lastMove ? this.lastMove.toSquare : '',
      lms: this.lastMoveString || '',
      c: this.children.map(c => c.serializeAsRepertoireNode())
    };
  }
}