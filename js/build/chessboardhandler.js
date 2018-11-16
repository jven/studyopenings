class ChessBoardHandler {
  constructor(chessBoard, repertoireBuilder, repertoireTreeView) {
    this.chessBoard_ = chessBoard;
    this.repertoireBuilder_ = repertoireBuilder;
    this.repertoireTreeView_ = repertoireTreeView;
    this.chess_ = new Chess();
  }

  onDragStart(square, piece) {}

  onDrop(fromSquare, toSquare) {
    var chessMove = {
      from: fromSquare,
      to: toSquare,
      promotion: 'q'
    };
    var oldPgn = this.chess_.pgn();
    if (!this.chess_.move(chessMove)) {
      return 'snapback';
    }
    this.repertoireBuilder_.addMove(oldPgn, new Move(fromSquare, toSquare));
    return '';
  }

  onSnapEnd() {
    this.chessBoard_.setPositionImmediately(this.chess_.fen());
    this.repertoireTreeView_.refresh();
  }

  onMouseoutSquare() {}

  onMouseoverSquare(square, piece) {}
}