class Line {
  constructor(
      startPosition,
      opponentFirstMove,
      moves,
      color) {
    this.startPosition = startPosition;
    this.opponentFirstMove = opponentFirstMove;
    this.moves = moves;
    this.color = color;
  }

  static fromPgnForInitialPosition(pgn) {
    var chess = new Chess();
    if (!chess.load_pgn(pgn)) {
      console.error('Invalid PGN: ' + pgn);
    }

    var moves = chess
        .history({verbose: true})
        .map(m => new Move(m.from, m.to));
    return new Line(
        'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        null /* opponentFirstMove */,
        moves,
        Color.WHITE);
  }

  static fromMoveStringForInitialPosition(moveString) {
    var tokens = moveString.split(' ').filter(t => !!t);
    var pgn = '';
    for (var i = 0; i < tokens.length; i += 2) {
      pgn += (i / 2 + 1) + '. ' + tokens[i] + ' ';
      if (tokens[i + 1]) {
        pgn += tokens[i + 1] + ' ';
      }
    }

    return Line.fromPgnForInitialPosition(pgn);
  }
}