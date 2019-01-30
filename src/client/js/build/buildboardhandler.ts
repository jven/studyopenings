import { NullAnnotator } from '../annotation/nullannotator';
import { BoardHandler } from '../board/boardhandler';
import { Config } from '../common/config';
import { RefreshableView } from '../common/refreshableview';
import { Toasts } from '../common/toasts';
import { AddMoveFailureReason } from '../tree/addmoveresult';
import { TreeModel } from '../tree/treemodel';
import { CurrentRepertoireUpdater } from './currentrepertoireupdater';
import { TreeController } from './treecontroller';

export class BuildBoardHandler implements BoardHandler {
  private treeModel_: TreeModel;
  private treeController_: TreeController;
  private modeView_: RefreshableView;
  private updater_: CurrentRepertoireUpdater;

  constructor(
      treeModel: TreeModel,
      treeController: TreeController,
      modeView: RefreshableView,
      updater: CurrentRepertoireUpdater) {
    this.treeModel_ = treeModel;
    this.treeController_ = treeController;
    this.modeView_ = modeView;
    this.updater_ = updater;
  }

  onMove(fromSquare: string, toSquare: string): void {
    let pgn = this.treeModel_.getSelectedViewInfo(NullAnnotator.INSTANCE).pgn;
    const result = this.treeModel_.addMove(pgn, {fromSquare, toSquare});
    if (result.success && !result.failureReason) {
      this.updater_.updateCurrentRepertoire();
      return;
    }

    switch (result.failureReason) {
      case AddMoveFailureReason.ILLEGAL_MOVE:
        Toasts.warning('Couldn\'t add move', 'That move is illegal.');
        break;
      case AddMoveFailureReason.EXCEEDED_MAXIMUM_LINE_DEPTH:
        Toasts.warning(
            'Couldn\'t add move',
            `Opening lines can\'t be longer than `
                + `${Config.MAXIMUM_LINE_DEPTH_IN_PLY} ply.`);
        break;
      case AddMoveFailureReason.EXCEEDED_MAXIMUM_NUM_NODES:
        Toasts.warning(
            'Couldn\'t add move',
            `Repertoires can\'t contain more than `
                + `${Config.MAXIMUM_TREE_NODES_PER_REPERTOIRE} total moves.`);
        break;
      default:
        throw new Error(`Unknown failure reason: ${result.failureReason}`);
    }
  }

  onChange(): void {
    this.modeView_.refresh();
  }

  onScroll(e: WheelEvent): void {
    if (e.deltaY < 0) {
      this.treeController_.selectRight();
    } else if (e.deltaY > 0) {
      this.treeController_.selectLeft();
    }
    e.preventDefault();
  }
}
