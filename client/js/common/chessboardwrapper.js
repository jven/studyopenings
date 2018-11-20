class ChessBoardWrapper {
  constructor() {
    this.chessBoard_ = null;
  }

  setChessBoard(chessBoard) {
    this.chessBoard_ = chessBoard;
  }

  resetSize() {
    if (this.chessBoard_) {
      this.chessBoard_.resize();
    }
  }

  setInitialPositionImmediately() {
    this.setPositionImmediately_('start', false /* useAnimation */);
  }

  setPositionImmediately(position) {
    this.setPositionImmediately_(position, true /* useAnimation */);
  }

  setPositionImmediately_(position, useAnimation) {
    if (this.chessBoard_) {
      this.chessBoard_.position(position, useAnimation);
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