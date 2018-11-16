function main() {
  const chessBoardWrapper = new ChessBoardWrapper();
  const treeModel = new TreeModel();
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
    onDragStart: handler.onDragStart.bind(handler),
    onDrop: handler.onDrop.bind(handler),
    onSnapEnd: handler.onSnapEnd.bind(handler),
    onMouseoutSquare: handler.onMouseoutSquare.bind(handler),
    onMouseoverSquare: handler.onMouseoverSquare.bind(handler)
  });
  chessBoardWrapper.setChessBoard(chessBoard);
  chessBoardWrapper.setInitialPositionImmediately();

  treeView.refresh();
};

window.onload = main;