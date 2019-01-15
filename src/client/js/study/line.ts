import { Color } from '../../../protocol/color';
import { Move } from '../common/move';

declare var Chess: any;

export class Line {
  public startPosition: string;
  public opponentFirstMove: Move | null;
  public moves: Move[];
  public color: Color;

  constructor(
      startPosition: string,
      opponentFirstMove: Move | null,
      moves: Move[],
      color: Color) {
    this.startPosition = startPosition;
    this.opponentFirstMove = opponentFirstMove;
    this.moves = moves;
    this.color = color;
  }

  static fromPgnForInitialPosition(pgn: string, color: Color) {
    var chess = new Chess();
    if (!chess.load_pgn(pgn)) {
      throw new Error('Invalid PGN: ' + pgn);
    }

    var opponentFirstMove = null;
    var history: {from: string, to: string}[] = chess.history({verbose: true});
    var moves = history.map(m => new Move(m.from, m.to));
    if (color == Color.BLACK) {
      opponentFirstMove = moves.splice(0, 1)[0];
    }
    return new Line(
        'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        opponentFirstMove,
        moves,
        color);
  }

  static fromMoveStringsForInitialPosition(
      moveStrings: string[], color: Color) {
    var pgn = '';
    for (var i = 0; i < moveStrings.length; i += 2) {
      pgn += (i / 2 + 1) + '. ' + moveStrings[i] + ' ';
      if (moveStrings[i + 1]) {
        pgn += moveStrings[i + 1] + ' ';
      }
    }
    return Line.fromPgnForInitialPosition(pgn, color);
  }
}
