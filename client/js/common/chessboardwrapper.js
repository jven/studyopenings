class ChessBoardWrapper {
  constructor() {
    this.chessBoard_ = null;
  }

  setChessBoard(chessBoard) {
    this.chessBoard_ = chessBoard;
  }

  setInitialPositionImmediately() {
    this.setPositionImmediately('start');
  }

  setPositionImmediately(position) {
    if (this.chessBoard_) {
      this.chessBoard_.position(position);
    }
  }

  setPositionAfterTimeout(position, timeout) {
    setTimeout(this.setPositionImmediately.bind(this, position), timeout);
  }

  setOrientationForColor(color) {
    if (this.chessBoard_) {
      this.chessBoard_.orientation(color == Color.WHITE ? 'white' : 'black');
    }
  }
}