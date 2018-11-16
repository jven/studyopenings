class RepertoireTreeView {
  constructor(element, repertoireBuilder) {
    this.element_ = element;
    this.repertoireBuilder_ = repertoireBuilder;
  }

  refresh() {
    this.repertoireBuilder_.traverseDepthFirst(traverseInfo => {
      console.log(traverseInfo);
    });
  }
}