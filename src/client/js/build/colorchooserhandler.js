import { Color } from '../../../protocol/color';

export class ColorChooserHandler {
  constructor(repertoireModel, treeView) {
    this.repertoireModel_ = repertoireModel;
    this.treeView_ = treeView;
  }

  handleButtonClicks(colorChooserWhiteElement, colorChooserBlackElement) {
    colorChooserWhiteElement.onclick =
        this.handleClick_.bind(this, Color.WHITE);
    colorChooserBlackElement.onclick =
        this.handleClick_.bind(this, Color.BLACK);
  }

  handleClick_(color) {
    this.repertoireModel_.setRepertoireColor(color);
    this.treeView_.refresh();
  }
}