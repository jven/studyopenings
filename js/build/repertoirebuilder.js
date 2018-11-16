class RepertoireBuilder {
  constructor() {
    this.chess_ = new Chess();
    this.rootNode_ = new TreeNode_(
        this.chess_.fen(),
        this.chess_.pgn(),
        null /* lastMove */,
        0);
    this.pgnToNode_ = {};
    this.pgnToNode_[this.chess_.pgn()] = this.rootNode_;
  }

  addMove(pgn, move) {
    if (pgn && !this.chess_.load_pgn(pgn)) {
      console.error('Invalid PGN: ' + pgn);
      return;
    }
    var parentNode = this.pgnToNode_[pgn];
    if (!parentNode) {
      console.error('No node exists for PGN: ' + pgn);
      return;
    }
    var chessMove = {
      from: move.fromSquare,
      to: move.toSquare,
      promotion: 'q'
    };
    if (!this.chess_.move(chessMove)) {
      console.error('Invalid move: ' + move);
      return;
    }
    var childPosition = this.chess_.fen();
    var childPgn = this.chess_.pgn();
    var childNode = parentNode.addChild(childPosition, childPgn, move);
    this.pgnToNode_[childPgn] = childNode;
  }

  traverseDepthFirst(callback) {
    this.rootNode_.traverseDepthFirst(callback);
  }
}

class TreeNode_ {
  constructor(position, pgn, lastMove, depth) {
    this.position_ = position;
    this.pgn_ = pgn;
    this.lastMove_ = lastMove;
    this.depth_ = depth;
    this.children_ = [];
  }

  addChild(position, pgn, lastMove) {
    const child = new TreeNode_(position, pgn, lastMove, this.depth_ + 1);
    this.children_.push(child);
    return child;
  }

  traverseDepthFirst(callback) {
    const traverseInfo = {
      position: this.position_,
      pgn: this.pgn_,
      lastMove: this.lastMove_,
      lastMoveNumber: Math.floor((this.depth_ + 1) / 2),
      lastMoveColor: this.depth_ % 2 == 1 ? Color.WHITE : Color.BLACK
    };
    callback(traverseInfo);
    this.children_.forEach(child => child.traverseDepthFirst(callback));
  }
}