import { ImpressionCode } from '../../../protocol/impression/impressioncode';
import { ImpressionSender } from '../../impressions/impressionsender';
import { TreeModel } from '../tree/treemodel';
import { TreeView } from './treeview';

export class TreeNodeHandler {
  private impressionSender_: ImpressionSender;
  private treeModel_: TreeModel;
  private treeView_: TreeView | null;

  constructor(impressionSender: ImpressionSender, treeModel: TreeModel) {
    this.impressionSender_ = impressionSender;
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
    this.impressionSender_.sendImpression(ImpressionCode.TREE_SELECT_NODE);
    this.treeModel_.selectPgn(pgn);
    this.treeView_.refresh();
  }
}
