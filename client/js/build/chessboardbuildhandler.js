class ChessBoardBuildHandler {
  constructor(repertoireModel, treeView) {
    this.repertoireModel_ = repertoireModel;
    this.treeView_ = treeView;
  }

  onDragStart(square, piece) {
    return this.repertoireModel_.existsLegalMoveFromSquareInSelectedPosition(
        square);
  }

  onDrop(fromSquare, toSquare) {
    var pgn = this.repertoireModel_.getSelectedViewInfo().pgn;
    return this.repertoireModel_.addMove(pgn, new Move(fromSquare, toSquare))
        ? ''
        : 'snapback';
  }

  onSnapEnd() {
    this.treeView_.refresh();
  }

  onMouseoutSquare() {}

  onMouseoverSquare(square, piece) {}
}