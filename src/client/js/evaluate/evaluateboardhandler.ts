import { BoardHandler } from '../board/boardhandler';
import { TreeNavigator } from '../tree/treenavigator';

export class EvaluateBoardHandler implements BoardHandler {
  private treeNavigator_: TreeNavigator;

  constructor(treeNavigator: TreeNavigator) {
    this.treeNavigator_ = treeNavigator;
  }

  onMove(from: string, to: string): void {}

  onChange(): void {}

  onScroll(e: WheelEvent): void {
    this.treeNavigator_.selectFromWheelEvent(e);
  }
}
