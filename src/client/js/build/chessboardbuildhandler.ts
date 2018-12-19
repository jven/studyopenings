import { Move } from '../common/move';
import { RepertoireModel } from '../common/repertoiremodel';
import { TreeView } from './treeview';

export class ChessBoardBuildHandler {
  private repertoireModel_: RepertoireModel;
  private treeView_: TreeView;

  constructor(repertoireModel: RepertoireModel, treeView: TreeView) {
    this.repertoireModel_ = repertoireModel;
    this.treeView_ = treeView;
  }

  onMove(fromSquare: string, toSquare: string): void {
    var pgn = this.repertoireModel_.getSelectedViewInfo().pgn;
    this.repertoireModel_.addMoveAndSave(pgn, new Move(fromSquare, toSquare));
  }

  onChange(): void {
    this.treeView_.refresh();
  }
}