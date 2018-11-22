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

  static fromPgnForInitialPosition(pgn, color) {
    var chess = new Chess();
    if (!chess.load_pgn(pgn)) {
      console.error('Invalid PGN: ' + pgn);
      return null;
    }

    var opponentFirstMove = null;
    var moves = chess
        .history({verbose: true})
        .map(m => new Move(m.from, m.to));
    if (color == Color.BLACK) {
      opponentFirstMove = moves.splice(0, 1)[0];
    }
    return new Line(
        'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        opponentFirstMove,
        moves,
        color);
  }
}