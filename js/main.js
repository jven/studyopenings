function main() {
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

  var repertoire = new Repertoire([
    Line.fromMoveStringForInitialPosition('d4 d5 Bf4 Bf5 e3 e6 Bd3'),
    Line.fromMoveStringForInitialPosition('d4 Nf6 Bf4')
  ]);
  repertoireStudier.study(repertoire);
};

window.onload = main;