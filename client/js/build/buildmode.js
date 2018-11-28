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
    const buildBoardElement = document.getElementById('buildBoard');
    const chessBoard = Chessground(buildBoardElement, {
      movable: {
        free: false
      },
      events: {
        move: handler.onMove.bind(handler),
        change: handler.onChange.bind(handler)
      }
    });
    $(window).resize(
        this.chessBoardWrapper_.redraw.bind(this.chessBoardWrapper_));
    this.chessBoardWrapper_.setChessBoard(chessBoard, buildBoardElement);
  }

  preSwitchTo() {
    this.chessBoardWrapper_.setInitialPositionImmediately();
    return this.server_
        .loadRepertoire()
        .then(this.onLoadRepertoire_.bind(this));
  }

  postSwitchTo() {
    this.chessBoardWrapper_.redraw();
  }

  onKeyDown(e) {
    if (e.keyCode == 70) {
      // F
      this.repertoireModel_.flipRepertoireColor();
      this.treeView_.refresh();
    } else if (e.keyCode == 37) {
      // Left arrow
      if (this.repertoireModel_.hasPreviousPgn()) {
        this.repertoireModel_.selectPreviousPgn();
        this.treeView_.refresh();
      }
    } else if (e.keyCode == 38) {
      // Up arrow
      if (this.repertoireModel_.hasPreviousSiblingPgn()) {
        this.repertoireModel_.selectPreviousSiblingPgn();
        this.treeView_.refresh();
      }
    } else if (e.keyCode == 39) {
      // Right arrow
      if (this.repertoireModel_.hasNextPgn()) {
        this.repertoireModel_.selectNextPgn();
        this.treeView_.refresh();
      }
    } else if (e.keyCode == 40) {
      // Down arrow
      if (this.repertoireModel_.hasNextSiblingPgn()) {
        this.repertoireModel_.selectNextSiblingPgn();
        this.treeView_.refresh();
      }
    } else if (e.keyCode == 8) {
      // Backspace
      if (this.repertoireModel_.canRemoveSelectedPgn()) {
        this.repertoireModel_.removeSelectedPgn();
        this.treeView_.refresh();
      }
    }
  }

  onLoadRepertoire_(repertoireJson) {
    this.repertoireModel_.updateFromServer(repertoireJson);
    this.treeView_.refresh();
  }
}