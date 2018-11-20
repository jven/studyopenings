class Repertoire {
  constructor(lines) {
    this.lines_ = lines;
  }

  getNextLine() {
    return this.lines_[Math.floor(Math.random() * this.lines_.length)];
  }

  static fromModel(repertoireModel) {
    var lines = [];
    repertoireModel.traverseDepthFirst(viewInfo => {
      if (!viewInfo.numChildren) {
        lines.push(Line.fromPgnForInitialPosition(viewInfo.pgn));
      }
    });
    return new Repertoire(lines);
  }
}
