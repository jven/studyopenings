export interface BoardHandler {
  /**
   * Handles the user dragging a piece from one square to another, before the
   * board position is updated.
   */
  onMove(from: string, to: string): void;

  /** Handles the board position being updated. */
  onChange(): void;

  /** Handles the user scrolling on the board. */
  onScroll(e: WheelEvent): void;
}
