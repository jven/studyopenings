class RepertoireModel {
  constructor(server) {
    this.server_ = server;
    this.makeEmpty_();
  }

  getChessForState() {
    return this.chess_;
  }

  isEmpty() {
    const viewInfo = this.rootNode_.toViewInfo(
        this.selectedNode_,
        this.pgnToNode_,
        this.fenToPgn_,
        this.repertoireColor_);
    return !viewInfo.numChildren;
  }

  addMoveAndSave(pgn, move) {
    var result = this.maybeAddMove_(pgn, move);
    this.saveToServer_();
    return result;
  }

  maybeAddMove_(pgn, move) {
    if (!pgn) {
      this.chess_.reset();
    }
    if (pgn && !this.chess_.load_pgn(pgn)) {
      console.error('Tried to add move from invalid PGN: ' + pgn);
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
      childNode = this.addNewMove_(
          pgn,
          childPosition,
          childPgn,
          this.chess_.moves().length,
          this.chess_.turn() == 'w' ? Color.WHITE : Color.BLACK,
          move,
          history[history.length - 1]);
    }

    // Select the new child node.
    this.selectedNode_ = childNode;

    return true;
  }

  addNewMove_(
      parentPgn,
      childPosition,
      childPgn,
      numLegalMoves,
      colorToMove,
      lastMove,
      lastMoveString) {
    const parentNode = this.pgnToNode_[parentPgn];
    if (!parentNode) {
      console.error('No node exists for PGN: ' + parentPgn);
      return false;
    }
    const childNode = parentNode.addChild(
        childPosition,
        childPgn,
        numLegalMoves,
        colorToMove,
        lastMove,
        lastMoveString);
    this.pgnToNode_[childPgn] = childNode;
    const normalizedFen = normalizeFen_(childPosition, numLegalMoves);
    if (!this.fenToPgn_[normalizedFen]) {
      this.fenToPgn_[normalizedFen] = [];
    }
    this.fenToPgn_[normalizedFen].push(childPgn);
    return childNode;
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
    nodeToDelete.traverseDepthFirstPreorder(
      viewInfo => {
        delete this.pgnToNode_[viewInfo.pgn];
        const normalizedFen = normalizeFen_(
            viewInfo.position, viewInfo.numLegalMoves);
        if (!this.fenToPgn_[normalizedFen]) {
          console.error('Unexpected state.');
        }
        this.fenToPgn_[normalizedFen] = this.fenToPgn_[normalizedFen]
            .filter(e => e != viewInfo.pgn);
      },
      this.selectedNode_,
      this.pgnToNode_,
      this.fenToPgn_,
      this.repertoireColor_);

    this.saveToServer_();
  }

  traverseDepthFirstPreorder(callback) {
    this.rootNode_.traverseDepthFirstPreorder(
        callback,
        this.selectedNode_,
        this.pgnToNode_,
        this.fenToPgn_,
        this.repertoireColor_);
  }

  traverseDepthFirstPostorder(callback) {
    this.rootNode_.traverseDepthFirstPostorder(
        callback,
        this.selectedNode_,
        this.pgnToNode_,
        this.fenToPgn_,
        this.repertoireColor_);
  }

  getRepertoireColor() {
    return this.repertoireColor_;
  }

  flipRepertoireColor() {
    const newColor =
        this.repertoireColor_ == Color.WHITE ? Color.BLACK : Color.WHITE;
    this.setRepertoireColor(newColor);
  }

  setRepertoireColor(color) {
    this.repertoireColor_ = color;
    this.saveToServer_();
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

  hasPreviousSiblingPgn() {
    return this.selectedNode_.previousSiblingOrSelf(
        false /* stopWithManyChildren */) != this.selectedNode_;
  }

  selectPreviousSiblingPgn() {
    this.selectedNode_ = this.selectedNode_.previousSiblingOrSelf(
        false /* stopWithManyChildren */);
    this.chess_.load_pgn(this.selectedNode_.pgn());
  }

  hasNextSiblingPgn() {
    return this.selectedNode_.nextSiblingOrSelf(
        false /* stopWithManyChildren */) != this.selectedNode_;
  }

  selectNextSiblingPgn() {
    this.selectedNode_ = this.selectedNode_.nextSiblingOrSelf(
        false /* stopWithManyChildren */);
    this.chess_.load_pgn(this.selectedNode_.pgn());
  }

  getSelectedViewInfo() {
    return this.selectedNode_.toViewInfo(
        this.selectedNode_,
        this.pgnToNode_,
        this.fenToPgn_,
        this.repertoireColor_);
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
    const initialFen = normalizeFen_(
        this.chess_.fen(), this.chess_.moves().length);
    const initialPgn = this.chess_.pgn();
    this.rootNode_ = new TreeNode_(
        null,
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

  loadExample(repertoireJson) {
    this.updateFromServer(repertoireJson);
    this.saveToServer_();
  }

  parseRecursive_(node) {
    const children = node.children || node.c;
    for (var i = 0; i < children.length; i++) {
      var child = children[i];
      if (child.fen) {
        this.addNewMove_(
            node.pgn,
            child.fen,
            child.pgn,
            child.nlm,
            child.ctm == 'w' ? Color.WHITE : Color.BLACK,
            new Move(child.lmf, child.lmt),
            child.lms);
      } else {
        // The repertoire was saved with the legacy storage representation which
        // did not store the position. In order to construct the model with this
        // representation, a Chess object must be initialized for each position
        // which is expensive.
        console.log('Parsing legacy storage format.');
        this.maybeAddMove_(
            node.pgn,
            new Move(child.lastMoveFrom, child.lastMoveTo));
      }
      this.parseRecursive_(child);
    }
  }

  saveToServer_() {
    this.server_.saveRepertoire(this.serializeForServer());
  }
}

class TreeNode_ {
  constructor(
      parent,
      position,
      pgn,
      numLegalMoves,
      lastMove,
      lastMoveString,
      depth) {
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

  pgn() {
    return this.pgn_;
  }

  addChild(
      position, pgn, numLegalMoves, colorToMove, lastMove, lastMoveString) {
    const child = new TreeNode_(
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

  removeChildPgn(pgnToRemove) {
    for (var i = 0; i < this.children_.length; i++) {
      if (this.children_[i].pgn_ == pgnToRemove) {
        this.children_.splice(i, 1);
        return;
      }
    }
  }

  toViewInfo(selectedNode, pgnToNode, fenToPgn, repertoireColor) {
    const transposition = this.calculateTransposition_(
        pgnToNode, fenToPgn, repertoireColor);
    return {
      position: this.position_,
      pgn: this.pgn_,
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
      warnings: this.calculateWarnings_(
          fenToPgn, repertoireColor, transposition),
      transposition: transposition
    };
  }

  parentOrSelf() {
    return this.parent_ ? this.parent_ : this;
  }

  firstChildOrSelf() {
    return this.children_.length ? this.children_[0] : this;
  }

  previousSiblingOrSelf(stopWithManyChildren) {
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

  nextSiblingOrSelf(stopWithManyChildren) {
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
      callback, selectedNode, pgnToNode, fenToPgn, repertoireColor) {
    callback(this.toViewInfo(
        selectedNode, pgnToNode, fenToPgn, repertoireColor));
    this.children_.forEach(
        child => child.traverseDepthFirstPreorder(
            callback, selectedNode, pgnToNode, fenToPgn, repertoireColor));
  }

  traverseDepthFirstPostorder(
      callback, selectedNode, pgnToNode, fenToPgn, repertoireColor) {
    this.children_.forEach(
        child => child.traverseDepthFirstPostorder(
            callback, selectedNode, pgnToNode, fenToPgn, repertoireColor));
    callback(this.toViewInfo(
        selectedNode, pgnToNode, fenToPgn, repertoireColor));
  }

  serializeForServer() {
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

  calculateWarnings_(fenToPgn, repertoireColor, transposition) {
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

  calculateTransposition_(pgnToNode, fenToPgn, repertoireColor) {
    const normalizedFen = normalizeFen_(this.position_, this.numLegalMoves_);
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

function normalizeFen_(fen, numLegalMoves) {
  // Remove the half move counts and en passant tokens at the end. To treat en
  // passant positions as different, we append the number of legal moves.
  return fen.split(' ').slice(0, 3).join(' ') + numLegalMoves;
}