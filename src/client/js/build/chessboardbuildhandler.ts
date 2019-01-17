import { NullAnnotator } from '../annotate/nullannotator';
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
    this.treeModel_.addMove(pgn, {fromSquare, toSquare});
    this.updater_.updateCurrentRepertoire();
  }

  onChange(): void {
    this.treeView_.refresh();
  }
}
