class TreeNodeHandler {
  constructor(repertoireModel) {
    this.repertoireModel_ = repertoireModel;
    this.treeView_ = null;
  }

  setTreeView(treeView) {
    this.treeView_ = treeView;
  }

  onClick(pgn) {
    this.repertoireModel_.selectPgn(pgn);
    this.treeView_.refresh();
  }
}