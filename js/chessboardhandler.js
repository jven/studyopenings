class ChessBoardHandler {
  constructor(lineStudier) {
    this.chessBoard_ = null;
    this.lineStudier_ = lineStudier;
    this.lastTryResult_ = null;
  }

  setChessBoard(chessBoard) {
    this.chessBoard_ = chessBoard;
  }

  onDragStart(square, piece) {
    return this.lineStudier_.existLegalMovesFrom(square);
  }

  onDrop(fromSquare, toSquare) {
    var tryResult = this.lineStudier_.tryMove(new Move(fromSquare, toSquare));
    if (tryResult.type == TryResultType.WRONG_MOVE) {
      return 'snapback';
    }

    this.lastTryResult_ = tryResult;
    return '';
  }

  onSnapEnd() {
    if (!this.lastTryResult_ || !this.lastTryResult_.afterMyMovePosition) {
      this.lastTryResult_ = null;
      return;
    }

    this.chessBoard_.position(this.lastTryResult_.afterMyMovePosition);
    if (this.lastTryResult_.afterOpponentReplyPosition) {
      var positionAfterTimeout = this.lastTryResult_.afterOpponentReplyPosition;
      setTimeout(function() {
        this.chessBoard_.position(positionAfterTimeout);
      }.bind(this), 500);
    }
    this.lastTryResult_ = null;
  }

  onMouseoutSquare() {}

  onMouseoverSquare(square, piece) {}
}