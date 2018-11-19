class StudyMode {
  constructor() {
    this.treeModel_ = new TreeModel();

    const chessBoardWrapper = new ChessBoardWrapper();
    const lineStudier = new LineStudier(chessBoardWrapper);
    this.repertoireStudier_ = new RepertoireStudier(lineStudier);
    const handler = new ChessBoardStudyHandler(chessBoardWrapper, lineStudier);
    
    const chessBoard = ChessBoard('studyBoard', {
      draggable: true,
      onDragStart: handler.onDragStart.bind(handler),
      onDrop: handler.onDrop.bind(handler),
      onSnapEnd: handler.onSnapEnd.bind(handler),
      onMouseoutSquare: handler.onMouseoutSquare.bind(handler),
      onMouseoverSquare: handler.onMouseoverSquare.bind(handler)
    });
    chessBoardWrapper.setChessBoard(chessBoard);
  }

  switchTo() {
    ServerWrapper.loadRepertoire().then(this.onLoadRepertoire_.bind(this));
  }

  onLoadRepertoire_(repertoireJson) {
    this.treeModel_.updateFromServer(repertoireJson);
    var repertoire = Repertoire.fromTreeModel(this.treeModel_);
    this.repertoireStudier_.study(repertoire);
  }
}