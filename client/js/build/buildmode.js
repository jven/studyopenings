class BuildMode {
  constructor() {
    this.chessBoardWrapper_ = new ChessBoardWrapper();
    this.repertoireModel_ = new RepertoireModel();
    
    const treeNodeHandler = new TreeNodeHandler(this.repertoireModel_);
    this.treeView_ = new TreeView(
        document.getElementById('treeView'),
        this.repertoireModel_,
        treeNodeHandler,
        this.chessBoardWrapper_);
    treeNodeHandler.setTreeView(this.treeView_);
    const handler = new ChessBoardBuildHandler(
        this.repertoireModel_, this.treeView_);

    const chessBoard = ChessBoard('buildBoard', {
      draggable: true,
      moveSpeed: Config.CHESSBOARD_MOVE_SPEED_MS,
      onDragStart: handler.onDragStart.bind(handler),
      onDrop: handler.onDrop.bind(handler),
      onSnapEnd: handler.onSnapEnd.bind(handler),
      onMouseoutSquare: handler.onMouseoutSquare.bind(handler),
      onMouseoverSquare: handler.onMouseoverSquare.bind(handler)
    });
    $(window).resize(chessBoard.resize);
    this.chessBoardWrapper_.setChessBoard(chessBoard);
  }

  switchTo() {
    this.chessBoardWrapper_.setInitialPositionImmediately();
    return ServerWrapper
        .loadRepertoire()
        .then(this.onLoadRepertoire_.bind(this));
  }

  onKeyDown(e) {
    if (e.keyCode == 37) {
      this.repertoireModel_.selectPreviousPgn();
      this.treeView_.refresh();
    } else if (e.keyCode == 39) {
      this.repertoireModel_.selectNextPgn();
      this.treeView_.refresh();
    } else if (e.keyCode == 8) {
      this.repertoireModel_.removeSelectedPgn();
      this.treeView_.refresh();
    }
  }

  onLoadRepertoire_(repertoireJson) {
    this.repertoireModel_.updateFromServer(repertoireJson);
    this.treeView_.refresh();
  }
}