import { ImpressionCode } from '../../../protocol/impression/impressioncode';
import { RefreshableView } from '../common/refreshableview';
import { ImpressionSender } from '../impressions/impressionsender';
import { TreeModel } from './treemodel';

export class TreeNavigator {
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

  selectLeft(): void {
    if (this.treeModel_.hasPreviousPgn()) {
      this.impressionSender_.sendImpression(ImpressionCode.TREE_SELECT_LEFT);
      this.treeModel_.selectPreviousPgn();
      this.modeView_.refresh();
    }
  }

  selectRight(): void {
    if (this.treeModel_.hasNextPgn()) {
      this.impressionSender_.sendImpression(ImpressionCode.TREE_SELECT_RIGHT);
      this.treeModel_.selectNextPgn();
      this.modeView_.refresh();
    }
  }

  selectDown(): void {
    if (this.treeModel_.hasNextSiblingPgn()) {
      this.impressionSender_.sendImpression(ImpressionCode.TREE_SELECT_DOWN);
      this.treeModel_.selectNextSiblingPgn();
      this.modeView_.refresh();
    }
  }

  selectUp(): void {
    if (this.treeModel_.hasPreviousSiblingPgn()) {
      this.impressionSender_.sendImpression(ImpressionCode.TREE_SELECT_UP);
      this.treeModel_.selectPreviousSiblingPgn();
      this.modeView_.refresh();
    }
  }

  selectFromWheelEvent(e: WheelEvent): void {
    if (e.deltaY < 0) {
      this.selectRight();
    } else if (e.deltaY > 0) {
      this.selectLeft();
    }
    e.preventDefault();
  }
}
