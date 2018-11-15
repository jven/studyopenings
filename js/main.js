function main() {
  const lineStudier = new LineStudier();
  const handler = new ChessBoardHandler(lineStudier);
  const chessBoard = ChessBoard('board', {
    draggable: true,
    onDragStart: handler.onDragStart.bind(handler),
    onDrop: handler.onDrop.bind(handler),
    onSnapEnd: handler.onSnapEnd.bind(handler),
    onMouseoutSquare: handler.onMouseoutSquare.bind(handler),
    onMouseoverSquare: handler.onMouseoverSquare.bind(handler)
  });
  handler.setChessBoard(chessBoard);

  var line = new Line(
      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -',
      null /* opponentFirstMove */,
      [
        new Move('a2', 'a4'),
        new Move('h7', 'h5'),
        new Move('a4', 'a5'),
        new Move('h5', 'h4'),
        new Move('a5', 'a6'),
        new Move('h4', 'h3'),
        new Move('a6', 'b7'),
        new Move('h3', 'g2'),
        new Move('b7', 'a8'),
        new Move('g2', 'h1'),
        new Move('a8', 'h1')
      ],
      Color.WHITE);
  lineStudier.study(line);
  chessBoard.position(line.startPosition);
  chessBoard.orientation(line.color == Color.WHITE ? 'white' : 'black');
};

window.onload = main;