import { ImpressionCode } from '../../../protocol/impression/impressioncode';
import { RefreshableView } from '../common/refreshableview';
import { ImpressionSender } from '../impressions/impressionsender';
import { TreeModel } from './treemodel';

export class TreeNodeHandler {
  private impressionSender_: ImpressionSender;
  private treeModel_: TreeModel;
  private modeView_: RefreshableView;

  constructor(
      impressionSender: ImpressionSender,
      treeModel: TreeModel,
      modeView: RefreshableView) {
    this.impressionSender_ = impressionSender;
    this.treeModel_ = treeModel;
    this.modeView_ = modeView;
  }

  onClick(pgn: string) {
    this.impressionSender_.sendImpression(ImpressionCode.TREE_SELECT_NODE);
    this.treeModel_.selectPgn(pgn);
    this.modeView_.refresh();
  }
}
