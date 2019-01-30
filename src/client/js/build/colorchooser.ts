import { Color } from '../../../protocol/color';
import { ImpressionCode } from '../../../protocol/impression/impressioncode';
import { RefreshableView } from '../common/refreshableview';
import { ImpressionSender } from '../impressions/impressionsender';
import { TreeModel } from '../tree/treemodel';
import { CurrentRepertoireUpdater } from './currentrepertoireupdater';

enum Classes {
  SELECTED_COLOR = 'selectedColor'
}

export class ColorChooser implements RefreshableView {
  private whiteButton_: HTMLElement;
  private blackButton_: HTMLElement;
  private impressionSender_: ImpressionSender;
  private treeModel_: TreeModel;
  private modeView_: RefreshableView;
  private updater_: CurrentRepertoireUpdater;

  constructor(
      whiteButton: HTMLElement,
      blackButton: HTMLElement,
      impressionSender: ImpressionSender,
      treeModel: TreeModel,
      modeView: RefreshableView,
      updater: CurrentRepertoireUpdater) {
    this.whiteButton_ = whiteButton;
    this.blackButton_ = blackButton;
    this.impressionSender_ = impressionSender;
    this.treeModel_ = treeModel;
    this.modeView_ = modeView;
    this.updater_ = updater;

    whiteButton.onclick = () => this.handleClick_(Color.WHITE);
    blackButton.onclick = () => this.handleClick_(Color.BLACK);
  }

  refresh(): void {
    const color = this.treeModel_.getRepertoireColor();
    this.whiteButton_.classList.toggle(
        Classes.SELECTED_COLOR, color == Color.WHITE);
    this.blackButton_.classList.toggle(
        Classes.SELECTED_COLOR, color == Color.BLACK);
  }

  private handleClick_(color: Color): void {
    this.impressionSender_.sendImpression(
        ImpressionCode.TREE_SET_REPERTOIRE_COLOR, {color});
    this.treeModel_.setRepertoireColor(color);
    this.modeView_.refresh();
    this.updater_.updateCurrentRepertoire();
  }
}
