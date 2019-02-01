import { NullAnnotator } from '../annotation/nullannotator';
import { Board } from '../board/board';
import { RefreshableView } from '../common/refreshableview';
import { TreeModel } from '../tree/treemodel';

export class ChildMoveDrawer implements RefreshableView {
  private treeModel_: TreeModel;
  private board_: Board;

  constructor(treeModel: TreeModel, board: Board) {
    this.treeModel_ = treeModel;
    this.board_ = board;
  }

  refresh(): void {
    this.board_.removeDrawings();
    const selectedViewInfo
        = this.treeModel_.getSelectedViewInfo(NullAnnotator.INSTANCE);
    selectedViewInfo.childMoves.forEach(m =>
        this.board_.drawArrow(m.fromSquare, m.toSquare, 'green'));
  }
}
