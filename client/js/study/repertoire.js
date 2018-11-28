class Repertoire {
  constructor(color, pgnToViewInfo, pgnToDescendentCount) {
    this.color_ = color;
    this.pgnToViewInfo_ = pgnToViewInfo;
    this.pgnToDescendentCount_ = pgnToDescendentCount;
  }

  getNextLine() {
    var currentViewInfo = this.pgnToViewInfo_[''];
    if (!currentViewInfo || !currentViewInfo.numChildren) {
      return null;
    }

    const moves = [];
    const visitedPgns = {};
    while (currentViewInfo.transposition || currentViewInfo.numChildren) {
      if (visitedPgns[currentViewInfo.pgn]) {
        console.error('Infinite loop when computing the next line.');
        return null;
      }
      visitedPgns[currentViewInfo.pgn] = true;
      if (currentViewInfo.transposition) {
        currentViewInfo
            = this.pgnToViewInfo_[currentViewInfo.transposition.pgn];
        continue;
      }
      currentViewInfo
          = this.pgnToViewInfo_[this.randomChildPgn_(currentViewInfo)];
      moves.push(currentViewInfo.lastMoveString);
    }
    return Line.fromMoveStringsForInitialPosition(moves, this.color_);
  }

  randomChildPgn_(viewInfo) {
    const childDescendents = viewInfo.childPgns.map(childPgn => {
      if (!this.pgnToDescendentCount_[childPgn]) {
        console.error(
            'Unknown descendent count for child PGN: ' + childPgn);
        return 0;
      }
      return this.pgnToDescendentCount_[childPgn];
    });
    const totalDescendents = childDescendents.reduce((a, b) => a + b);
    const r = Math.floor(Math.random() * totalDescendents);
    var s = 0;
    for (var i = 0; i < childDescendents.length; i++) {
      s += childDescendents[i];
      if (r < s) {
        return viewInfo.childPgns[i];
      }
    }

    console.error('Could not pick child PGN.');
    return viewInfo.childPgns[0];
  }

  static fromModel(repertoireModel) {
    if (repertoireModel.isEmpty()) {
      return new Repertoire(Color.WHITE, {}, {});
    }

    const pgnToViewInfo = {};
    const pgnToDescendentCount = {};

    repertoireModel.traverseDepthFirstPostorder(viewInfo => {
      pgnToViewInfo[viewInfo.pgn] = viewInfo;
      if (viewInfo.transposition) {
        const transpositionPgn = viewInfo.transposition.pgn;
        if (!pgnToDescendentCount[transpositionPgn]) {
          console.error('Transposition visited before original.');
          return;
        }
        pgnToDescendentCount[viewInfo.pgn]
            = pgnToDescendentCount[transpositionPgn];
        return;
      }
      if (!viewInfo.numChildren) {
        pgnToDescendentCount[viewInfo.pgn] = 1;
        return;
      }
      var countSum = 0;
      viewInfo.childPgns.forEach(childPgn => {
        const childCount = pgnToDescendentCount[childPgn];
        if (!childCount) {
          console.error('Parent visited before child.');
          return;
        }
        countSum += childCount;
      });
      pgnToDescendentCount[viewInfo.pgn] = countSum;
    });
    return new Repertoire(
        repertoireModel.getRepertoireColor(),
        pgnToViewInfo,
        pgnToDescendentCount);
  }
}
