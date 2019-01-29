import { Color } from '../../../protocol/color';
import { ImpressionCode } from '../../../protocol/impression/impressioncode';
import { ImpressionSender } from '../impressions/impressionsender';
import { TreeModel } from '../tree/treemodel';
import { CurrentRepertoireUpdater } from './currentrepertoireupdater';
import { TreeView } from './treeview';

export class ColorChooser {
  private impressionSender_: ImpressionSender;
  private treeModel_: TreeModel;
  private treeView_: TreeView;
  private updater_: CurrentRepertoireUpdater;

  constructor(
      colorChooserWhiteElement: HTMLElement,
      colorChooserBlackElement: HTMLElement,
      impressionSender: ImpressionSender,
      treeModel: TreeModel,
      treeView: TreeView,
      updater: CurrentRepertoireUpdater) {
    this.impressionSender_ = impressionSender;
    this.treeModel_ = treeModel;
    this.treeView_ = treeView;
    this.updater_ = updater;

    colorChooserWhiteElement.onclick = () => this.handleClick_(Color.WHITE);
    colorChooserBlackElement.onclick = () => this.handleClick_(Color.BLACK);
  }

  private handleClick_(color: Color): void {
    this.impressionSender_.sendImpression(
        ImpressionCode.TREE_SET_REPERTOIRE_COLOR, {color});
    this.treeModel_.setRepertoireColor(color);
    this.treeView_.refresh();
    this.updater_.updateCurrentRepertoire();
  }
}
