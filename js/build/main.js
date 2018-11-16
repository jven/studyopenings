function main() {
  const chessBoardWrapper = new ChessBoardWrapper();
  const repertoireBuilder = new RepertoireBuilder();
  const repertoireTreeView = new RepertoireTreeView(
      document.getElementById('repertoireTreeView'), repertoireBuilder);
  const handler = new ChessBoardHandler(
      chessBoardWrapper, repertoireBuilder, repertoireTreeView);

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
};

window.onload = main;