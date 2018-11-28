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
        : null;
    var kingInCheck = this.positionForPiece_(chess, 'k');
    if (!chess.in_check()) {
      kingInCheck = null;
    }

    this.chessBoard_.set({
      check: kingInCheck,
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
        check: null,
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

  positionForPiece_(chess, piece, color) {
    const board = chess.board();
    for (var row = 0; row < 8; row++) {
      for (var col = 0; col < 8; col++) {
        if (board[row][col]
            && board[row][col].type == piece
            && board[row][col].color == chess.turn()) {
          return 'abcdefgh'[col] + (8 - row);
        }
      }
    }
    return null;
  }
}