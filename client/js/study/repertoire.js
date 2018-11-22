class Repertoire {
  constructor(lines) {
    this.lines_ = lines;
  }

  getNextLine() {
    return this.lines_.length
        ? this.lines_[Math.floor(Math.random() * this.lines_.length)]
        : null;
  }

  static fromModel(repertoireModel) {
    if (repertoireModel.isEmpty()) {
      return new Repertoire([]);
    }

    var color = repertoireModel.getRepertoireColor();
    var lines = [];
    repertoireModel.traverseDepthFirst(viewInfo => {
      if (!viewInfo.numChildren) {
        var line = Line.fromPgnForInitialPosition(viewInfo.pgn, color);
        if (line) {
          lines.push(line);
        }
      }
    });
    return new Repertoire(lines);
  }
}
