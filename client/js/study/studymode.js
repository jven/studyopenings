class StudyMode {
  constructor() {
    this.repertoireModel_ = new RepertoireModel();

    this.chessBoardWrapper_ = new ChessBoardWrapper();
    const lineStudier = new LineStudier(this.chessBoardWrapper_);
    this.repertoireStudier_ = new RepertoireStudier(lineStudier);
    const handler = new ChessBoardStudyHandler(
        this.chessBoardWrapper_, lineStudier);
    
    const chessBoard = ChessBoard('studyBoard', {
      draggable: true,
      moveSpeed: Config.CHESSBOARD_MOVE_SPEED_MS,
      onDragStart: handler.onDragStart.bind(handler),
      onDrop: handler.onDrop.bind(handler),
      onSnapEnd: handler.onSnapEnd.bind(handler),
      onMouseoutSquare: handler.onMouseoutSquare.bind(handler),
      onMouseoverSquare: handler.onMouseoverSquare.bind(handler)
    });
    this.chessBoardWrapper_.setChessBoard(chessBoard);
  }

  switchTo() {
    this.chessBoardWrapper_.setInitialPositionImmediately();
    return ServerWrapper
        .loadRepertoire()
        .then(this.onLoadRepertoire_.bind(this));
  }

  resetBoardSize() {
    this.chessBoardWrapper_.resetSize();
  }

  onLoadRepertoire_(repertoireJson) {
    this.repertoireModel_.updateFromServer(repertoireJson);
    var repertoire = Repertoire.fromModel(this.repertoireModel_);
    this.repertoireStudier_.study(repertoire);
  }
}