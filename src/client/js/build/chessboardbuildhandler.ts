import { Move } from '../common/move';
import { TreeModel } from '../tree/treemodel';
import { TreeView } from './treeview';
import { CurrentRepertoireUpdater } from './currentrepertoireupdater';

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
    var pgn = this.treeModel_.getSelectedViewInfo().pgn;
    this.treeModel_.addMove(pgn, new Move(fromSquare, toSquare));
    this.updater_.updateCurrentRepertoire();
  }

  onChange(): void {
    this.treeView_.refresh();
  }
}