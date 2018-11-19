class ChessBoardStudyHandler {
  constructor(chessBoard, lineStudier) {
    this.chessBoard_ = chessBoard;
    this.lineStudier_ = lineStudier;
    this.lastTryResult_ = null;
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

    this.chessBoard_.setPositionImmediately(
        this.lastTryResult_.afterMyMovePosition);
    if (this.lastTryResult_.afterOpponentReplyPosition) {
      this.chessBoard_.setPositionAfterTimeout(
          this.lastTryResult_.afterOpponentReplyPosition,
          Config.OPPONENT_REPLY_DELAY_MS);
    }
    this.lastTryResult_ = null;
  }

  onMouseoutSquare() {}

  onMouseoverSquare(square, piece) {}
}