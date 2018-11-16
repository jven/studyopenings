class ChessBoardHandler {
  constructor(treeModel, treeView) {
    this.treeModel_ = treeModel;
    this.treeView_ = treeView;
    this.chess_ = new Chess();
  }

  onDragStart(square, piece) {
    return this.treeModel_.existsLegalMoveFromSquareInSelectedPosition(square);
  }

  onDrop(fromSquare, toSquare) {
    var pgn = this.treeModel_.getSelectedViewInfo().pgn;
    return this.treeModel_.addMove(pgn, new Move(fromSquare, toSquare))
        ? ''
        : 'snapback';
  }

  onSnapEnd() {
    this.treeView_.refresh();
  }

  onMouseoutSquare() {}

  onMouseoverSquare(square, piece) {}
}