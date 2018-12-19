import { Color } from '../../../protocol/color';
import { RepertoireModel } from '../common/repertoiremodel';
import { TreeView } from './treeview';

export class ColorChooserHandler {
  private repertoireModel_: RepertoireModel;
  private treeView_: TreeView;

  constructor(repertoireModel: RepertoireModel, treeView: TreeView) {
    this.repertoireModel_ = repertoireModel;
    this.treeView_ = treeView;
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
  }
}