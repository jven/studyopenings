class BuildMode {
  constructor(server) {
    this.server_ = server;
    this.chessBoardWrapper_ = new ChessBoardWrapper();
    this.repertoireModel_ = new RepertoireModel(server);
    
    const treeNodeHandler = new TreeNodeHandler(this.repertoireModel_);
    this.treeView_ = new TreeView(
        document.getElementById('treeView'),
        document.getElementById('colorChooserWhite'),
        document.getElementById('colorChooserBlack'),
        document.getElementById('emptyTree'),
        document.getElementById('treeButtons'),
        this.repertoireModel_,
        treeNodeHandler,
        this.chessBoardWrapper_);
    treeNodeHandler.setTreeView(this.treeView_);

    const colorChooserHandler = new ColorChooserHandler(
        this.repertoireModel_, this.treeView_);
    colorChooserHandler.handleButtonClicks(
        document.getElementById('colorChooserWhite'),
        document.getElementById('colorChooserBlack'));

    const treeButtonHandler = new TreeButtonHandler(
        this.repertoireModel_, this.treeView_);
    treeButtonHandler.handleButtonClicks(
        document.getElementById('treeButtonLeft'),
        document.getElementById('treeButtonRight'),
        document.getElementById('treeButtonTrash'));

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
    return this.server_
        .loadRepertoire()
        .then(this.onLoadRepertoire_.bind(this));
  }

  resetBoardSize() {
    this.chessBoardWrapper_.resetSize();
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