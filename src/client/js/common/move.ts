export class Move {
  public fromSquare: string;
  public toSquare: string;

  constructor(fromSquare: string, toSquare: string) {
    this.fromSquare = fromSquare;
    this.toSquare = toSquare;
    // TODO(jven): May need a notion of promotion.
  }

  equals(other: Move) {
    return other.fromSquare == this.fromSquare &&
        other.toSquare == this.toSquare;
  }
}
