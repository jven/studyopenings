class RepertoireModel {
  constructor(server) {
    this.server_ = server;
    this.makeEmpty_();
  }

  isEmpty() {
    return !this.rootNode_.toViewInfo(this.selectedNode_).numChildren;
  }

  addMove(pgn, move) {
    if (!pgn) {
      this.chess_.reset();
    }
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
    var childNode = this.pgnToNode_[childPgn];
    if (!childNode) {
      // This is a new position. Add it to the tree.
      var history = this.chess_.history();
      var childNode = parentNode.addChild(
          childPosition, childPgn, move, history[history.length - 1]);
      this.pgnToNode_[childPgn] = childNode;
    }

    // Select the new child node.
    this.selectedNode_ = childNode;

    // Save to the server.
    this.server_.saveRepertoire(this.serializeForServer());

    return true;
  }

  canRemoveSelectedPgn() {
    return this.selectedNode_.parentOrSelf() != this.selectedNode_;
  }

  removeSelectedPgn() {
    const nodeToDelete = this.selectedNode_;
    if (!nodeToDelete.pgn()) {
      // Can't delete the start position.
      return;
    }

    // Select the parent of the node to delete.
    this.selectedNode_ = nodeToDelete.parentOrSelf();
    this.selectedNode_.removeChildPgn(nodeToDelete.pgn());
    this.chess_.load_pgn(this.selectedNode_.pgn());

    // Remove all the descendent nodes from the PGN to node map.
    nodeToDelete.traverseDepthFirst(viewInfo => {
      delete this.pgnToNode_[viewInfo.pgn];
    }, this.selectedNode_);

    // Save to the server.
    this.server_.saveRepertoire(this.serializeForServer());
  }

  traverseDepthFirst(callback) {
    this.rootNode_.traverseDepthFirst(callback, this.selectedNode_);
  }

  getRepertoireColor() {
    return this.repertoireColor_;
  }

  setRepertoireColor(color) {
    this.repertoireColor_ = color;

    // Save to the server.
    this.server_.saveRepertoire(this.serializeForServer());
  }

  selectPgn(pgn) {
    if (!pgn) {
      this.chess_.reset();
    }
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

  hasPreviousPgn() {
    return this.selectedNode_.parentOrSelf() != this.selectedNode_;
  }

  selectPreviousPgn() {
    this.selectedNode_ = this.selectedNode_.parentOrSelf();
    this.chess_.load_pgn(this.selectedNode_.pgn());
  }

  hasNextPgn() {
    return this.selectedNode_.firstChildOrSelf() != this.selectedNode_;
  }

  selectNextPgn() {
    this.selectedNode_ = this.selectedNode_.firstChildOrSelf();
    this.chess_.load_pgn(this.selectedNode_.pgn());
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

  serializeForServer() {
    return {
      color: this.repertoireColor_,
      root: this.rootNode_.serializeForServer()
    };
  }

  makeEmpty_() {
    this.chess_ = new Chess();
    this.rootNode_ = new TreeNode_(
        null,
        this.chess_.fen(),
        this.chess_.pgn(),
        null /* lastMove */,
        '' /* lastMoveString */,
        0);
    this.pgnToNode_ = {};
    this.pgnToNode_[this.chess_.pgn()] = this.rootNode_;
    this.selectedNode_ = this.rootNode_;
    this.repertoireColor_ = Color.WHITE;
  }

  updateFromServer(repertoireJson) {
    this.makeEmpty_();

    if (repertoireJson) {
      if (repertoireJson.color) {
        this.repertoireColor_ = repertoireJson.color;
      }
      if (repertoireJson.root) {
        this.parseRecursive_(repertoireJson.root);
      }
    }
    this.selectPgn('');
  }

  parseRecursive_(node) {
    for (var i = 0; i < node.children.length; i++) {
      var child = node.children[i];
      this.addMove(node.pgn, new Move(child.lastMoveFrom, child.lastMoveTo));
      this.parseRecursive_(child);
    }
  }
}

class TreeNode_ {
  constructor(parent, position, pgn, lastMove, lastMoveString, depth) {
    this.parent_ = parent;
    this.position_ = position;
    this.pgn_ = pgn;
    this.lastMove_ = lastMove;
    this.lastMoveString_ = lastMoveString;
    this.depth_ = depth;
    this.children_ = [];
  }

  pgn() {
    return this.pgn_;
  }

  addChild(position, pgn, lastMove, lastMoveString) {
    const child = new TreeNode_(
        this, position, pgn, lastMove, lastMoveString, this.depth_ + 1);
    this.children_.push(child);
    return child;
  }

  removeChildPgn(pgnToRemove) {
    for (var i = 0; i < this.children_.length; i++) {
      if (this.children_[i].pgn_ == pgnToRemove) {
        this.children_.splice(i, 1);
        return;
      }
    }
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

  parentOrSelf() {
    return this.parent_ ? this.parent_ : this;
  }

  firstChildOrSelf() {
    return this.children_.length ? this.children_[0] : this;
  }

  traverseDepthFirst(callback, selectedNode) {
    callback(this.toViewInfo(selectedNode));
    this.children_.forEach(
        child => child.traverseDepthFirst(callback, selectedNode));
  }

  serializeForServer() {
    return {
      pgn: this.pgn_,
      lastMoveFrom: this.lastMove_ ? this.lastMove_.fromSquare : '',
      lastMoveTo: this.lastMove_ ? this.lastMove_.toSquare : '',
      children: this.children_.map(c => c.serializeForServer())
    };
  }
}