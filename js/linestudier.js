class LineStudier {
  constructor(chessBoard) {
    this.chessBoard_ = chessBoard;
    this.chess_ = new Chess();
    this.studyState_ = null;
  }

  study(line) {
    // Cancel the pending completion promise.
    if (this.studyState_ && !this.studyState_.isComplete) {
      this.studyState_.completionPromiseResolveFn(false);
    }

    var studyState = new StudyState_(line);
    this.chess_.load(line.startPosition);
    var completionPromise = new Promise(function(resolve, reject) {
      studyState.completionPromiseResolveFn = resolve;
    });
    this.studyState_ = studyState;

    var afterOpponentMovePosition = null;
    if (line.opponentFirstMove) {
      afterOpponentMovePosition = this.applyMove_(line.opponentFirstMove);
    }

    this.chessBoard_.setPositionImmediately(line.startPosition);
    this.chessBoard_.setOrientationForColor(line.color);
    if (line.opponentFirstMove) {
      this.chessBoard_.setPositionAfterTimeout(afterOpponentMovePosition);
    }
    return completionPromise;
  }

  tryMove(move) {
    if (!this.studyState_ || this.studyState_.isComplete) {
      console.error('Inappropripate call to tryMove.');
      return null;
    }

    var expectedMove = this.studyState_.line.moves[this.studyState_.moveIndex];
    if (!move.equals(expectedMove)) {
      return new TryResult(TryResultType.WRONG_MOVE, null, null);
    }

    var afterMyMovePosition = this.applyMove_(expectedMove);
    if (this.studyState_.moveIndex >= this.studyState_.line.moves.length - 2) {
      this.studyState_.isComplete = true;
      this.studyState_.completionPromiseResolveFn(true);
      return new TryResult(
          TryResultType.RIGHT_MOVE_AND_DONE,
          afterMyMovePosition,
          null);
    }

    var opponentReply =
        this.studyState_.line.moves[this.studyState_.moveIndex + 1];
    var afterOpponentReplyPosition = this.applyMove_(opponentReply);
    this.studyState_.moveIndex += 2;
    return new TryResult(
        TryResultType.RIGHT_MOVE_WITH_REPLY,
        afterMyMovePosition,
        afterOpponentReplyPosition);
  }

  existLegalMovesFrom(square) {
    if (this.studyState_.isComplete) {
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

class StudyState_ {
  constructor(line) {
    this.line = line;
    this.moveIndex = 0;
    this.isComplete = false;
    this.completionPromiseResolveFn = null;
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