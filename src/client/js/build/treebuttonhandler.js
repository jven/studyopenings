export class TreeButtonHandler {
  constructor(repertoireModel, treeView) {
    this.repertoireModel_ = repertoireModel;
    this.treeView_ = treeView;
  }

  handleButtonClicks(
      treeButtonLeftElement, treeButtonRightElement, treeButtonTrashElement) {
    treeButtonLeftElement.onclick = this.handleLeft_.bind(this);
    treeButtonRightElement.onclick = this.handleRight_.bind(this);
    treeButtonTrashElement.onclick = this.handleTrash_.bind(this);
  }

  handleLeft_() {
    this.repertoireModel_.selectPreviousPgn();
    this.treeView_.refresh();
  }

  handleRight_() {
    this.repertoireModel_.selectNextPgn();
    this.treeView_.refresh();
  }

  handleTrash_() {
    this.repertoireModel_.removeSelectedPgn();
    this.treeView_.refresh();
  }
}