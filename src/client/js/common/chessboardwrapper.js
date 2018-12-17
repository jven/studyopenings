import { Color } from './color';

export class ChessBoardWrapper {
  constructor() {
    this.chessBoard_ = null;
    this.chessBoardElement_ = null;
  }

  setChessBoard(chessBoard, chessBoardElement) {
    this.chessBoard_ = chessBoard;
    this.chessBoardElement_ = chessBoardElement;
  }

  redraw() {
    if (this.chessBoard_ && this.chessBoardElement_) {
      this.removeClassName_('wrongMove');
      this.removeClassName_('rightMove');
      this.removeClassName_('finishLine');
      this.removeHints();
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
      this.removeHints();
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

  flashRightMove() {
    this.removeClassName_('wrongMove');
    this.removeClassName_('finishLine');
    this.flashClassName_('rightMove');
  }

  flashWrongMove() {
    this.removeClassName_('rightMove');
    this.removeClassName_('finishLine');
    this.flashClassName_('wrongMove');
  }

  flashFinishLine() {
    this.removeClassName_('wrongMove');
    this.removeClassName_('rightMove');
    this.flashClassName_('finishLine');
  }

  hintSquare(square) {
    this.hintMove(square /* fromSquare */, null /* toSquare */);
  }

  hintMove(fromSquare, toSquare) {
    if (this.chessBoard_) {
      this.chessBoard_.setAutoShapes([{
        orig: fromSquare,
        mouseSq: fromSquare,
        dest: toSquare,
        brush: 'red'
      }]);
    }
  }

  removeHints() {
    if (this.chessBoard_) {
      this.chessBoard_.setAutoShapes([]);
    }
  }

  removeClassName_(className) {
    if (this.chessBoardElement_) {
      this.chessBoardElement_.classList.remove(className);
    }
  }

  flashClassName_(className) {
    if (this.chessBoardElement_) {
      this.chessBoardElement_.classList.remove(className);
      // This is needed to restart the animation.
      void this.chessBoardElement_.offsetWidth;
      this.chessBoardElement_.classList.add(className);
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