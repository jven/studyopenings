import { Color } from '../../../protocol/color';
import { Repertoire } from '../../../protocol/storage';
import { Annotator } from '../annotate/annotator';
import { NullAnnotator } from '../annotate/nullannotator';
import { Move } from '../common/move';
import { ViewInfo } from '../common/viewinfo';
import { FenNormalizer } from './fennormalizer';
import { FenToPgnMap } from './fentopgnmap';
import { PgnToNodeMap } from './pgntonodemap';
import { TreeNode } from './treenode';

declare var Chess: any;

export class TreeModel {
  private chess_: any;
  private rootNode_: TreeNode | null;
  private selectedNode_: TreeNode | null;
  private pgnToNode_: PgnToNodeMap;
  private fenToPgn_: FenToPgnMap;
  private repertoireColor_: Color;
  private repertoireName_: string;

  constructor() {
    this.chess_ = null;
    this.rootNode_ = null;
    this.selectedNode_ = null;
    this.pgnToNode_ = {};
    this.fenToPgn_ = {};
    this.repertoireColor_ = Color.WHITE;
    this.repertoireName_ = '';

    this.makeEmpty_();
  }

  getChessForState(): any {
    return this.chess_;
  }

  isEmpty(): boolean {
    if (!this.rootNode_ || !this.selectedNode_) {
      throw new Error('Model not ready.');
    }
    const viewInfo = this.rootNode_.toViewInfo(
        this.selectedNode_,
        this.pgnToNode_,
        this.fenToPgn_,
        this.repertoireColor_,
        NullAnnotator.INSTANCE);
    return !viewInfo.numChildren;
  }

  addMove(pgn: string, move: Move | string): boolean {
    if (!pgn) {
      this.chess_.reset();
    }
    if (pgn && !this.chess_.load_pgn(pgn)) {
      throw new Error('Tried to add move from invalid PGN: ' + pgn);
    }
    const chessMove = typeof move === 'string'
        ? move
        : {
          from: move.fromSquare,
          to: move.toSquare,
          promotion: 'q'
        };
    if (!this.chess_.move(chessMove)) {
      // Illegal move.
      return false;
    }
    let childPosition = this.chess_.fen();
    let childPgn = this.chess_.pgn();
    let childNode = this.pgnToNode_[childPgn];
    if (!childNode) {
      // This is a new position. Add it to the tree.
      let history = this.chess_.history({verbose: true});
      const lastMove = history[history.length - 1];
      childNode = this.addNewMove_(
          pgn,
          childPosition,
          childPgn,
          this.chess_.moves().length,
          new Move(lastMove.from, lastMove.to),
          lastMove.san);
    }

    // Select the new child node.
    this.selectedNode_ = childNode;

    return true;
  }

  private addNewMove_(
      parentPgn: string,
      childPosition: string,
      childPgn: string,
      numLegalMoves: number,
      lastMove: Move,
      lastMoveString: string): TreeNode {
    const parentNode = this.pgnToNode_[parentPgn];
    if (!parentNode) {
      throw new Error('No node exists for PGN: ' + parentPgn);
    }
    const childNode = parentNode.addChild(
        childPosition,
        childPgn,
        numLegalMoves,
        lastMove,
        lastMoveString);
    this.pgnToNode_[childPgn] = childNode;
    const normalizedFen = FenNormalizer.normalize(childPosition, numLegalMoves);
    if (!this.fenToPgn_[normalizedFen]) {
      this.fenToPgn_[normalizedFen] = [];
    }
    this.fenToPgn_[normalizedFen].push(childPgn);
    return childNode;
  }

  canRemoveSelectedPgn(): boolean {
    if (!this.selectedNode_) {
      throw new Error('Model not ready.');
    }
    return this.selectedNode_.parentOrSelf() != this.selectedNode_;
  }

  removeSelectedPgn(): void {
    if (!this.selectedNode_) {
      throw new Error('Model not ready.');
    }
    const nodeToDelete = this.selectedNode_;
    if (!nodeToDelete.pgn) {
      // Can't delete the start position.
      return;
    }

    // Select the parent of the node to delete.
    this.selectedNode_ = nodeToDelete.parentOrSelf();
    this.selectedNode_.removeChildPgn(nodeToDelete.pgn);
    this.chess_.load_pgn(this.selectedNode_.pgn);

    // Remove all the descendent nodes from the PGN to node map.
    nodeToDelete.traverseDepthFirst(
        viewInfo => {
          delete this.pgnToNode_[viewInfo.pgn];
          const normalizedFen = FenNormalizer.normalize(
              viewInfo.position, viewInfo.numLegalMoves);
          if (!this.fenToPgn_[normalizedFen]) {
            throw new Error('Unexpected state.');
          }
          this.fenToPgn_[normalizedFen] = this.fenToPgn_[normalizedFen]
              .filter(e => e != viewInfo.pgn);
        },
        this.selectedNode_,
        this.pgnToNode_,
        this.fenToPgn_,
        this.repertoireColor_,
        NullAnnotator.INSTANCE);
  }

  /**
   * Traverses the nodes in the tree depth-first and pre-order.
   *
   * That is, parents are visited before their children and children are visited
   * before siblings.
   */
  traverseDepthFirst(
      callbackFn: (v: ViewInfo) => void,
      annotator: Annotator): void {
    if (!this.rootNode_ || !this.selectedNode_) {
      throw new Error('Model not ready.');
    }
    this.rootNode_.traverseDepthFirst(
        callbackFn,
        this.selectedNode_,
        this.pgnToNode_,
        this.fenToPgn_,
        this.repertoireColor_,
        annotator);
  }

  getRepertoireColor(): Color {
    return this.repertoireColor_;
  }

  flipRepertoireColor(): void {
    const newColor =
        this.repertoireColor_ == Color.WHITE ? Color.BLACK : Color.WHITE;
    this.setRepertoireColor(newColor);
  }

  setRepertoireColor(color: Color): void {
    this.repertoireColor_ = color;
  }

  getRepertoireName(): string {
    return this.repertoireName_;
  }

  setRepertoireName(repertoireName: string): void {
    this.repertoireName_ = repertoireName;
  }

  selectPgn(pgn: string): void {
    if (!pgn) {
      this.chess_.reset();
    }
    if (pgn && !this.chess_.load_pgn(pgn)) {
      throw new Error('Tried to select invalid PGN: ' + pgn);
    }
    let node = this.pgnToNode_[pgn];
    if (!node) {
      throw new Error('No node exists for PGN: ' + pgn);
    }
    this.selectedNode_ = node;
  }

  hasPreviousPgn(): boolean {
    if (!this.selectedNode_) {
      throw new Error('Model not ready.');
    }
    return this.selectedNode_.parentOrSelf() != this.selectedNode_;
  }

  selectPreviousPgn(): void {
    if (!this.selectedNode_) {
      throw new Error('Model not ready.');
    }
    this.selectedNode_ = this.selectedNode_.parentOrSelf();
    this.chess_.load_pgn(this.selectedNode_.pgn);
  }

  hasNextPgn(): boolean {
    if (!this.selectedNode_) {
      throw new Error('Model not ready.');
    }
    return this.selectedNode_.firstChildOrSelf() != this.selectedNode_;
  }

  selectNextPgn(): void {
    if (!this.selectedNode_) {
      throw new Error('Model not ready.');
    }
    this.selectedNode_ = this.selectedNode_.firstChildOrSelf();
    this.chess_.load_pgn(this.selectedNode_.pgn);
  }

  hasPreviousSiblingPgn(): boolean {
    if (!this.selectedNode_) {
      throw new Error('Model not ready.');
    }
    return this.selectedNode_.previousSiblingOrSelf(
        false /* stopWithManyChildren */) != this.selectedNode_;
  }

  selectPreviousSiblingPgn(): void {
    if (!this.selectedNode_) {
      throw new Error('Model not ready.');
    }
    this.selectedNode_ = this.selectedNode_.previousSiblingOrSelf(
        false /* stopWithManyChildren */);
    this.chess_.load_pgn(this.selectedNode_.pgn);
  }

  hasNextSiblingPgn(): boolean {
    if (!this.selectedNode_) {
      throw new Error('Model not ready.');
    }
    return this.selectedNode_.nextSiblingOrSelf(
        false /* stopWithManyChildren */) != this.selectedNode_;
  }

  selectNextSiblingPgn(): void {
    if (!this.selectedNode_) {
      throw new Error('Model not ready.');
    }
    this.selectedNode_ = this.selectedNode_.nextSiblingOrSelf(
        false /* stopWithManyChildren */);
    this.chess_.load_pgn(this.selectedNode_.pgn);
  }

  getSelectedViewInfo(annotator: Annotator): ViewInfo {
    if (!this.selectedNode_) {
      throw new Error('Model not ready.');
    }
    return this.selectedNode_.toViewInfo(
        this.selectedNode_,
        this.pgnToNode_,
        this.fenToPgn_,
        this.repertoireColor_,
        annotator);
  }

  serializeAsRepertoire(): Repertoire {
    if (!this.rootNode_) {
      throw new Error('Model not ready.');
    }
    return {
      name: this.repertoireName_,
      color: this.repertoireColor_,
      root: this.rootNode_.serializeAsRepertoireNode()
    };
  }

  exportToPgn(): string {
    if (!this.rootNode_) {
      throw new Error('Model not ready.');
    }
    const rootPgn = this.rootNode_.exportChildrenToPgn(
        false /* forceFirstChildVerbose */);
    return rootPgn ? rootPgn + ' *' : '*';
  }

  private makeEmpty_(): void {
    this.chess_ = new Chess();
    const initialFen = FenNormalizer.normalize(
        this.chess_.fen(), this.chess_.moves().length);
    const initialPgn = this.chess_.pgn();
    this.rootNode_ = new TreeNode(
        null /* parent */,
        initialFen,
        initialPgn,
        this.chess_.moves().length,
        null /* lastMove */,
        '' /* lastMoveString */,
        0);
    this.pgnToNode_ = {};
    this.pgnToNode_[initialPgn] = this.rootNode_;
    this.fenToPgn_ = {};
    this.fenToPgn_[initialFen] = [initialPgn];
    this.selectedNode_ = this.rootNode_;
    this.repertoireColor_ = Color.WHITE;
  }

  loadRepertoire(repertoire: Repertoire): void {
    this.makeEmpty_();

    if (repertoire) {
      this.repertoireName_ = repertoire.name;
      this.repertoireColor_ = repertoire.color;
      if (repertoire.root) {
        this.parseRecursive_(repertoire.root);
      }
    }
    this.selectPgn('');
  }

  private parseRecursive_(node: any): void {
    const children = node.children || node.c;
    for (let i = 0; i < children.length; i++) {
      let child = children[i];
      if (child.fen) {
        this.addNewMove_(
            node.pgn,
            child.fen,
            child.pgn,
            child.nlm,
            new Move(child.lmf, child.lmt),
            child.lms);
      } else {
        // The repertoire was saved with the legacy storage representation which
        // did not store the position. In order to construct the model with this
        // representation, a Chess object must be initialized for each position
        // which is expensive.
        console.log('Parsing legacy storage format.');
        this.addMove(
            node.pgn,
            new Move(child.lastMoveFrom, child.lastMoveTo));
      }
      this.parseRecursive_(child);
    }
  }
}
