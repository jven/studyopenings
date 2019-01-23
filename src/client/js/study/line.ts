import { Color } from '../../../protocol/color';
import { Move } from '../../../protocol/move';

declare var Chess: any;

export class Line {
  public pgn: string;
  public startPosition: string;
  public opponentFirstMove: Move | null;
  public moves: Move[];
  public color: Color;

  constructor(
      pgn: string,
      startPosition: string,
      opponentFirstMove: Move | null,
      moves: Move[],
      color: Color) {
    this.pgn = pgn;
    this.startPosition = startPosition;
    this.opponentFirstMove = opponentFirstMove;
    this.moves = moves;
    this.color = color;
  }

  static fromPgnForInitialPosition(pgn: string, color: Color) {
    let chess = new Chess();
    if (!chess.load_pgn(pgn)) {
      throw new Error('Invalid PGN: ' + pgn);
    }

    let opponentFirstMove = null;
    let history: {from: string, to: string}[] = chess.history({verbose: true});
    let moves = history.map(m => {
      return {
        fromSquare: m.from,
        toSquare: m.to
      };
    });
    if (color == Color.BLACK) {
      opponentFirstMove = moves.splice(0, 1)[0];
    }
    return new Line(
        pgn,
        'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        opponentFirstMove,
        moves,
        color);
  }
}
