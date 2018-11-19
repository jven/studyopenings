class StudyMode {
  constructor() {
    this.treeModel_ = new TreeModel();

    this.chessBoardWrapper_ = new ChessBoardWrapper();
    const lineStudier = new LineStudier(this.chessBoardWrapper_);
    this.repertoireStudier_ = new RepertoireStudier(lineStudier);
    const handler = new ChessBoardStudyHandler(
        this.chessBoardWrapper_, lineStudier);
    
    const chessBoard = ChessBoard('studyBoard', {
      draggable: true,
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

  onLoadRepertoire_(repertoireJson) {
    this.treeModel_.updateFromServer(repertoireJson);
    var repertoire = Repertoire.fromTreeModel(this.treeModel_);
    this.repertoireStudier_.study(repertoire);
  }
}