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
    const history = chess.history({verbose: true});
    const lastMove = history.length
        ? new Move(history[0].from, history[0].to)
        : null;
    const color = chess.turn() == 'w' ? 'white' : 'black';
    const legalMoves = {};
    chess.moves({verbose: true}).forEach(m => {
      if (!legalMoves[m.from]) {
        legalMoves[m.from] = [];
      }
      legalMoves[m.from].push(m.to);
    });
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
    this.setPositionImmediately_('start', null, false /* useAnimation */);
  }

  setPositionImmediately(position, lastMove) {
    this.setPositionImmediately_(position, lastMove, true /* useAnimation */);
  }

  setPositionImmediately_(position, lastMove, useAnimation) {
    if (this.chessBoard_) {
      this.chessBoard_.set({
        fen: position,
        lastMove: lastMove ? [lastMove.fromSquare, lastMove.toSquare] : null
      });
    }
  }

  setPositionAfterTimeout(position, lastMove, timeout) {
    setTimeout(
        this.setPositionImmediately.bind(this, position, lastMove),
        timeout);
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