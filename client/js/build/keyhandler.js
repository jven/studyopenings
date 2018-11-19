class KeyHandler {
  constructor(treeModel, treeView) {
    this.treeModel_ = treeModel;
    this.treeView_ = treeView;
  }

  onKey(e) {
    if (e.keyCode == 37) {
      this.treeModel_.selectPreviousPgn();
      this.treeView_.refresh();
    } else if (e.keyCode == 39) {
      this.treeModel_.selectNextPgn();
      this.treeView_.refresh();
    } else if (e.keyCode == 8) {
      this.treeModel_.removeSelectedPgn();
      this.treeView_.refresh();
    }
  }
}