class KeyHandler {
  constructor(repertoireModel, treeView) {
    this.repertoireModel_ = repertoireModel;
    this.treeView_ = treeView;
  }

  onKey(e) {
    if (e.keyCode == 37) {
      this.repertoireModel_.selectPreviousPgn();
      this.treeView_.refresh();
    } else if (e.keyCode == 39) {
      this.repertoireModel_.selectNextPgn();
      this.treeView_.refresh();
    } else if (e.keyCode == 8) {
      this.repertoireModel_.removeSelectedPgn();
      this.treeView_.refresh();
    }
  }
}