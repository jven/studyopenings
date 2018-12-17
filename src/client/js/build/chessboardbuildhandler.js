class ChessBoardBuildHandler {
  constructor(repertoireModel, treeView) {
    this.repertoireModel_ = repertoireModel;
    this.treeView_ = treeView;
  }

  onMove(fromSquare, toSquare) {
    var pgn = this.repertoireModel_.getSelectedViewInfo().pgn;
    this.repertoireModel_.addMoveAndSave(pgn, new Move(fromSquare, toSquare));
  }

  onChange() {
    this.treeView_.refresh();
  }
}