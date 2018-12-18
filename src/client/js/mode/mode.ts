/**
 * A single mode of the application.
 *
 * The application has exactly one selected mode at any given time which handles
 * user input, receives events from the picker, etc.. At any point, the
 * application may exit the currently selected mode and enter a different mode,
 * by which process the newly entered mode becomes selected.
 */
export interface Mode {
  /**
   * Performs any logic necessary before the mode is entered and before the
   * currently selected mode is exited.
   *
   * Returns a promise which is fulfilled when the mode is ready to be selected.
   */
  preEnter(): Promise<void>;

  /**
   * Performs any logic necessary before entering another mode.
   *
   * Returns a promise which is fulfilled when the mode is ready to be
   * unselected.
   */
  exit(): Promise<void>;

  /**
   * Performs any logic necessary after the mode is entered and after the
   * previously selected mode is exited.
   *
   * Returns a promise which is fulfilled when the mode is finished being
   * selected.
   */
  postEnter(): Promise<void>;

  /**
   * Handles the given key event when the mode is selected.
   */
  onKeyDown(e: KeyboardEvent): void;
}