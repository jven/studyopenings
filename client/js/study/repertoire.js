class Repertoire {
  constructor(lines) {
    this.lines_ = lines;
  }

  getNextLine() {
    return this.lines_[Math.floor(Math.random() * this.lines_.length)];
  }

  static fromModel(repertoireModel) {
    var color = repertoireModel.getRepertoireColor();
    var lines = [];
    repertoireModel.traverseDepthFirst(viewInfo => {
      if (!viewInfo.numChildren) {
        lines.push(Line.fromPgnForInitialPosition(viewInfo.pgn, color));
      }
    });
    return new Repertoire(lines);
  }
}
