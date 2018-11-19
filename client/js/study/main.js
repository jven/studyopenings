function main() {
  ServerWrapper.loadRepertoire().then(onLoadRepertoire);
};

function onLoadRepertoire(repertoireJson) {
  const treeModel = TreeModel.parseFromServer(repertoireJson);

  const chessBoardWrapper = new ChessBoardWrapper();
  const lineStudier = new LineStudier(chessBoardWrapper);
  const repertoireStudier = new RepertoireStudier(lineStudier);
  const handler = new ChessBoardHandler(chessBoardWrapper, lineStudier);
  
  const chessBoard = ChessBoard('board', {
    draggable: true,
    onDragStart: handler.onDragStart.bind(handler),
    onDrop: handler.onDrop.bind(handler),
    onSnapEnd: handler.onSnapEnd.bind(handler),
    onMouseoutSquare: handler.onMouseoutSquare.bind(handler),
    onMouseoverSquare: handler.onMouseoverSquare.bind(handler)
  });
  chessBoardWrapper.setChessBoard(chessBoard);

  var repertoire = Repertoire.fromTreeModel(treeModel);
  repertoireStudier.study(repertoire);
};

window.onload = main;