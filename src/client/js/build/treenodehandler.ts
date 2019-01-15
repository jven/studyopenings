import { TreeModel } from '../tree/treemodel';
import { TreeView } from './treeview';

export class TreeNodeHandler {
  private treeModel_: TreeModel;
  private treeView_: TreeView | null;

  constructor(treeModel: TreeModel) {
    this.treeModel_ = treeModel;
    this.treeView_ = null;
  }

  setTreeView(treeView: TreeView) {
    this.treeView_ = treeView;
  }

  onClick(pgn: string) {
    if (!this.treeView_) {
      throw new Error('TreeNodeHandler not ready.');
    }
    this.treeModel_.selectPgn(pgn);
    this.treeView_.refresh();
  }
}
