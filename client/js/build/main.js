function main() {
  ServerWrapper.loadRepertoire().then(onLoadRepertoire);
};

function onLoadRepertoire(repertoireJson) {
  const treeModel = TreeModel.parseFromServer(repertoireJson);
  const chessBoardWrapper = new ChessBoardWrapper();
  
  const treeNodeHandler = new TreeNodeHandler(treeModel);
  const treeView = new TreeView(
      document.getElementById('treeView'),
      treeModel,
      treeNodeHandler,
      chessBoardWrapper);
  treeNodeHandler.setTreeView(treeView);
  const handler = new ChessBoardHandler(treeModel, treeView);

  const chessBoard = ChessBoard('board', {
    draggable: true,
    moveSpeed: Config.CHESSBOARD_MOVE_SPEED_MS,
    onDragStart: handler.onDragStart.bind(handler),
    onDrop: handler.onDrop.bind(handler),
    onSnapEnd: handler.onSnapEnd.bind(handler),
    onMouseoutSquare: handler.onMouseoutSquare.bind(handler),
    onMouseoverSquare: handler.onMouseoverSquare.bind(handler)
  });
  chessBoardWrapper.setChessBoard(chessBoard);
  chessBoardWrapper.setInitialPositionImmediately();

  const keyHandler = new KeyHandler(treeModel, treeView);
  document.body.onkeydown = keyHandler.onKey.bind(keyHandler);

  treeView.refresh();
};

window.onload = main;