class ChessBoardWrapper {
  constructor() {
    this.chessBoard_ = null;
  }

  setChessBoard(chessBoard) {
    this.chessBoard_ = chessBoard;
  }

  redraw() {
    if (this.chessBoard_) {
      this.chessBoard_.redrawAll();
    }
  }

  setStateFromChess(chess) {
    const color = chess.turn() == 'w' ? 'white' : 'black';
    const legalMoves = {};
    chess.moves({verbose: true}).forEach(m => {
      if (!legalMoves[m.from]) {
        legalMoves[m.from] = [];
      }
      legalMoves[m.from].push(m.to);
    });
    const history = chess.history({verbose: true});
    const lastMove = history.length
        ? [history[history.length - 1].from, history[history.length - 1].to]
        : null
    this.chessBoard_.set({
      fen: chess.fen(),
      lastMove: lastMove,
      turnColor: color,
      movable: {
        color: color,
        dests: legalMoves
      }
    });
  }

  setInitialPositionImmediately() {
    if (this.chessBoard_) {
      this.chessBoard_.set({
        fen: 'start',
        lastMove: null
      });
    }
  }

  setOrientationForColor(color) {
    if (this.chessBoard_) {
      var newOrientation = color == Color.WHITE ? 'white' : 'black';
      if (this.chessBoard_.state.orientation != newOrientation) {
        this.chessBoard_.set({orientation: newOrientation});
      }
    }
  }
}