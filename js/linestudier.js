class LineStudier {
  constructor() {
    this.chess_ = null;
    this.currentLine_ = null;
    this.currentMoveIndex_ = 0;
    this.currentStudyComplete_ = true;
  }

  study(line) {
    // this.chess_ = new Chess(line.startPosition);
    this.chess_ = new Chess();
    this.chess_.load(line.startPosition);
    this.currentLine_ = line;
    this.currentMoveIndex_ = 0;
    this.currentStudyComplete_ = false;

    var afterOpponentMovePosition = null;
    if (line.opponentFirstMove) {
      afterOpponentMovePosition = this.applyMove_(line.opponentFirstMove);
    }
    return new StudyResult(
        line.startPosition,
        line.color,
        line.opponentFirstMove,
        afterOpponentMovePosition);
  }

  tryMove(move) {
    var expectedMove = this.currentLine_.moves[this.currentMoveIndex_];
    if (!move.equals(expectedMove)) {
      return new TryResult(TryResultType.WRONG_MOVE, null, null);
    }

    var afterMyMovePosition = this.applyMove_(expectedMove);
    if (this.currentMoveIndex_ >= this.currentLine_.moves.length - 2) {
      this.currentStudyComplete_ = true;
      return new TryResult(
          TryResultType.RIGHT_MOVE_AND_DONE,
          afterMyMovePosition,
          null);
    }

    var opponentReply = this.currentLine_.moves[this.currentMoveIndex_ + 1];
    var afterOpponentReplyPosition = this.applyMove_(opponentReply);
    this.currentMoveIndex_ += 2;
    return new TryResult(
        TryResultType.RIGHT_MOVE_WITH_REPLY,
        afterMyMovePosition,
        afterOpponentReplyPosition);
  }

  existLegalMovesFrom(square) {
    if (this.currentStudyComplete_) {
      return false;
    }

    var legalMoves = this.chess_.moves({
      square: square,
      verbose: true
    });
    return !!legalMoves.length;
  }

  applyMove_(move) {
    this.chess_.move({
      from: move.fromSquare,
      to: move.toSquare,
      promotion: 'q'
    });
    return this.chess_.fen();
  }
}

class StudyResult {
  constructor(
      startPosition,
      color,
      opponentFirstMove,
      afterOpponentReplyPosition) {
    this.startPosition = startPosition;
    this.color = color;
    this.opponentFirstMove = opponentFirstMove;
    this.afterOpponentReplyPosition = afterOpponentReplyPosition;
  }
}

class TryResult {
  constructor(
      type, 
      afterMyMovePosition, 
      afterOpponentReplyPosition) {
    this.type = type;
    this.afterMyMovePosition = afterMyMovePosition;
    this.afterOpponentReplyPosition = afterOpponentReplyPosition;
  }
}

const TryResultType = {
  WRONG_MOVE: 'wrongMove',
  RIGHT_MOVE_WITH_REPLY: 'rightMoveWithReply',
  RIGHT_MOVE_AND_DONE: 'rightMoveAndDone'
};