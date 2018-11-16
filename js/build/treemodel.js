class TreeModel {
  constructor() {
    this.chess_ = new Chess();
    this.rootNode_ = new TreeNode_(
        this.chess_.fen(),
        this.chess_.pgn(),
        '' /* lastMoveString */,
        0);
    this.pgnToNode_ = {};
    this.pgnToNode_[this.chess_.pgn()] = this.rootNode_;
    this.selectedNode_ = this.rootNode_;
  }

  addMove(pgn, move) {
    if (pgn && !this.chess_.load_pgn(pgn)) {
      console.error('Tried to add move from invalid PGN: ' + pgn);
      return false;
    }
    var parentNode = this.pgnToNode_[pgn];
    if (!parentNode) {
      console.error('No node exists for PGN: ' + pgn);
      return false;
    }
    var chessMove = {
      from: move.fromSquare,
      to: move.toSquare,
      promotion: 'q'
    };
    if (!this.chess_.move(chessMove)) {
      // Illegal move.
      return false;
    }
    var childPosition = this.chess_.fen();
    var childPgn = this.chess_.pgn();
    var history = this.chess_.history();
    var childNode = parentNode.addChild(
        childPosition, childPgn, history[history.length - 1]);
    this.pgnToNode_[childPgn] = childNode;

    // Select the new child node.
    this.selectedNode_ = childNode;

    return true;
  }

  traverseDepthFirst(callback) {
    this.rootNode_.traverseDepthFirst(callback, this.selectedNode_);
  }

  selectPgn(pgn) {
    if (pgn && !this.chess_.load_pgn(pgn)) {
      console.error('Tried to select invalid PGN: ' + pgn);
      return;
    }
    var node = this.pgnToNode_[pgn];
    if (!node) {
      console.error('No node exists for PGN: ' + pgn);
      return;
    }
    this.selectedNode_ = node;
  }

  getSelectedViewInfo() {
    return this.selectedNode_.toViewInfo(this.selectedNode_);
  }

  existsLegalMoveFromSquareInSelectedPosition(square) {
    var legalMoves = this.chess_.moves({
      square: square,
      verbose: true
    });
    return !!legalMoves.length;
  }
}

class TreeNode_ {
  constructor(position, pgn, lastMoveString, depth) {
    this.position_ = position;
    this.pgn_ = pgn;
    this.lastMoveString_ = lastMoveString;
    this.depth_ = depth;
    this.children_ = [];
  }

  addChild(position, pgn, lastMoveString) {
    const child = new TreeNode_(position, pgn, lastMoveString, this.depth_ + 1);
    this.children_.push(child);
    return child;
  }

  toViewInfo(selectedNode) {
    return {
      position: this.position_,
      pgn: this.pgn_,
      lastMoveString: this.lastMoveString_,
      lastMovePly: this.depth_,
      lastMoveNumber: Math.floor((this.depth_ + 1) / 2),
      lastMoveColor: this.depth_ % 2 == 1 ? Color.WHITE : Color.BLACK,
      numChildren: this.children_.length,
      isSelected: this.pgn_ == selectedNode.pgn_
    };
  }

  traverseDepthFirst(callback, selectedNode) {
    callback(this.toViewInfo(selectedNode));
    this.children_.forEach(
        child => child.traverseDepthFirst(callback, selectedNode));
  }
}