import { NullAnnotator } from '../annotate/nullannotator';
import { Config } from '../common/config';
import { Toasts } from '../common/toasts';
import { AddMoveFailureReason } from '../tree/addmoveresult';
import { TreeModel } from '../tree/treemodel';
import { CurrentRepertoireUpdater } from './currentrepertoireupdater';
import { TreeView } from './treeview';

export class ChessBoardBuildHandler {
  private treeModel_: TreeModel;
  private treeView_: TreeView;
  private updater_: CurrentRepertoireUpdater;

  constructor(
      treeModel: TreeModel,
      treeView: TreeView,
      updater: CurrentRepertoireUpdater) {
    this.treeModel_ = treeModel;
    this.treeView_ = treeView;
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
      default:
        throw new Error(`Unknown failure reason: ${result.failureReason}`);
    }
  }

  onChange(): void {
    this.treeView_.refresh();
  }
}
