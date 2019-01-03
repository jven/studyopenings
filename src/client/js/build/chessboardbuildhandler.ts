import { Move } from '../common/move';
import { RepertoireModel } from '../common/repertoiremodel';
import { TreeView } from './treeview';
import { CurrentRepertoireUpdater } from '../common/currentrepertoireupdater';

export class ChessBoardBuildHandler {
  private repertoireModel_: RepertoireModel;
  private treeView_: TreeView;
  private updater_: CurrentRepertoireUpdater;

  constructor(
      repertoireModel: RepertoireModel,
      treeView: TreeView,
      updater: CurrentRepertoireUpdater) {
    this.repertoireModel_ = repertoireModel;
    this.treeView_ = treeView;
    this.updater_ = updater;
  }

  onMove(fromSquare: string, toSquare: string): void {
    var pgn = this.repertoireModel_.getSelectedViewInfo().pgn;
    this.repertoireModel_.addMove(pgn, new Move(fromSquare, toSquare));
    this.updater_.updateCurrentRepertoire();
  }

  onChange(): void {
    this.treeView_.refresh();
  }
}