import { TreeController } from "./treecontroller";

export class ChessBoardScrollHandler {
  private treeController_: TreeController;

  constructor(treeController: TreeController) {
    this.treeController_ = treeController;
  }

  handleScrollEventsOn(buildBoardElement: HTMLElement) {
    buildBoardElement.onwheel = e => this.onWheel_(e);
  }

  private onWheel_(e: WheelEvent) {
    if (e.deltaY < 0) {
      this.treeController_.selectRight();
    } else if (e.deltaY > 0) {
      this.treeController_.selectLeft();
    }
    e.preventDefault();
  }
}