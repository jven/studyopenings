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
        document.getElementById('treeButtonLeft'),
        document.getElementById('treeButtonRight'),
        document.getElementById('treeButtonTrash'),
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

    const exampleRepertoireHandler = new ExampleRepertoireHandler(
        this.repertoireModel_, this.server_, this.treeView_);
    exampleRepertoireHandler.handleButtonClicks(
        document.getElementById('exampleRepertoire'));

    const handler = new ChessBoardBuildHandler(
        this.repertoireModel_, this.treeView_);
    const chessBoard = Chessground(document.getElementById('buildBoard'), {
      movable: {
        free: false
      },
      events: {
        move: handler.onMove.bind(handler),
        change: handler.onChange.bind(handler)
      }
    });
    this.chessBoardWrapper_.setChessBoard(chessBoard);
  }

  switchTo() {
    this.chessBoardWrapper_.setInitialPositionImmediately();
    return this.server_
        .loadRepertoire()
        .then(this.onLoadRepertoire_.bind(this));
  }

  onKeyDown(e) {
    if (e.keyCode == 70) {
      // F
      this.repertoireModel_.flipRepertoireColor();
      this.treeView_.refresh();
    } else if (e.keyCode == 37) {
      // Left arrow
      this.repertoireModel_.selectPreviousPgn();
      this.treeView_.refresh();
    } else if (e.keyCode == 39) {
      // Right arrow
      this.repertoireModel_.selectNextPgn();
      this.treeView_.refresh();
    } else if (e.keyCode == 8) {
      // Backspace
      this.repertoireModel_.removeSelectedPgn();
      this.treeView_.refresh();
    }
  }

  onLoadRepertoire_(repertoireJson) {
    this.repertoireModel_.updateFromServer(repertoireJson);
    this.treeView_.refresh();
  }
}