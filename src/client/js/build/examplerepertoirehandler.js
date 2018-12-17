class ExampleRepertoireHandler {
  constructor(repertoireModel, server, treeView) {
    this.repertoireModel_ = repertoireModel;
    this.treeView_ = treeView;
  }

  handleButtonClicks(exampleRepertoireElement) {
    exampleRepertoireElement.onclick = this.handleClick_.bind(this);
  }

  handleClick_() {
    const exampleJson = JSON.parse(Repertoires.KINGS_GAMBIT);
    this.repertoireModel_.loadExample(exampleJson);
    this.treeView_.refresh();
  }
}