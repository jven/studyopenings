import { Color } from '../../../protocol/color';
import { RepertoireModel } from '../common/repertoiremodel';
import { TreeView } from './treeview';
import { CurrentRepertoireUpdater } from '../common/currentrepertoireupdater';

export class ColorChooserHandler {
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

  handleButtonClicks(
      colorChooserWhiteElement: HTMLElement,
      colorChooserBlackElement: HTMLElement): void {
    colorChooserWhiteElement.onclick =
        this.handleClick_.bind(this, Color.WHITE);
    colorChooserBlackElement.onclick =
        this.handleClick_.bind(this, Color.BLACK);
  }

  private handleClick_(color: Color): void {
    this.repertoireModel_.setRepertoireColor(color);
    this.treeView_.refresh();
    this.updater_.updateCurrentRepertoire();
  }
}