class Move {
  constructor(fromSquare, toSquare) {
    this.fromSquare = fromSquare;
    this.toSquare = toSquare;
    // TODO(jven): May need a notion of promotion.
  }

  equals(other) {
    return other.fromSquare == this.fromSquare &&
        other.toSquare == this.toSquare;
  }
}