class TreeNodeHandler {
  constructor(treeModel) {
    this.treeModel_ = treeModel;
    this.treeView_ = null;
  }

  setTreeView(treeView) {
    this.treeView_ = treeView;
  }

  onClick(pgn) {
    this.treeModel_.selectPgn(pgn);
    this.treeView_.refresh();
  }
}