import { ImpressionCode } from '../../../protocol/impression/impressioncode';
import { RefreshableView } from '../common/refreshableview';
import { ImpressionSender } from '../impressions/impressionsender';
import { TreeModel } from './treemodel';

export class TreeNodeHandler {
  private impressionSender_: ImpressionSender;
  private treeModel_: TreeModel;
  private buildModeView_: RefreshableView;

  constructor(
      impressionSender: ImpressionSender,
      treeModel: TreeModel,
      buildModeView: RefreshableView) {
    this.impressionSender_ = impressionSender;
    this.treeModel_ = treeModel;
    this.buildModeView_ = buildModeView;
  }

  onClick(pgn: string) {
    this.impressionSender_.sendImpression(ImpressionCode.TREE_SELECT_NODE);
    this.treeModel_.selectPgn(pgn);
    this.buildModeView_.refresh();
  }
}
