import { RepertoireModel } from '../tree/repertoiremodel';
import { TreeView } from './treeview';

export class TreeNodeHandler {
  private repertoireModel_: RepertoireModel;
  private treeView_: TreeView | null;

  constructor(repertoireModel: RepertoireModel) {
    this.repertoireModel_ = repertoireModel;
    this.treeView_ = null;
  }

  setTreeView(treeView: TreeView) {
    this.treeView_ = treeView;
  }

  onClick(pgn: string) {
    if (!this.treeView_) {
      throw new Error('TreeNodeHandler not ready.');
    }
    this.repertoireModel_.selectPgn(pgn);
    this.treeView_.refresh();
  }
}