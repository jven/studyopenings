class BuildMode {
  constructor() {
    this.chessBoardWrapper_ = new ChessBoardWrapper();
    this.treeModel_ = new TreeModel();
    
    const treeNodeHandler = new TreeNodeHandler(this.treeModel_);
    this.treeView_ = new TreeView(
        document.getElementById('treeView'),
        this.treeModel_,
        treeNodeHandler,
        this.chessBoardWrapper_);
    treeNodeHandler.setTreeView(this.treeView_);
    const handler = new ChessBoardBuildHandler(this.treeModel_, this.treeView_);

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
      this.treeModel_.selectPreviousPgn();
      this.treeView_.refresh();
    } else if (e.keyCode == 39) {
      this.treeModel_.selectNextPgn();
      this.treeView_.refresh();
    } else if (e.keyCode == 8) {
      this.treeModel_.removeSelectedPgn();
      this.treeView_.refresh();
    }
  }

  onLoadRepertoire_(repertoireJson) {
    this.treeModel_.updateFromServer(repertoireJson);
    this.treeView_.refresh();
  }
}