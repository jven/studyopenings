import { Color } from '../../../protocol/color';
import { RepertoireModel } from '../common/repertoiremodel';
import { TreeView } from './treeview';
import { ServerWrapper } from '../server/serverwrapper';
import { PickerController } from '../picker/pickercontroller';

export class ColorChooserHandler {
  private repertoireModel_: RepertoireModel;
  private treeView_: TreeView;
  private server_: ServerWrapper;
  private pickerController_: PickerController;

  constructor(
      repertoireModel: RepertoireModel,
      treeView: TreeView,
      server: ServerWrapper,
      pickerController: PickerController) {
    this.repertoireModel_ = repertoireModel;
    this.treeView_ = treeView;
    this.server_ = server;
    this.pickerController_ = pickerController;
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

    const repertoireId = this.pickerController_.getSelectedMetadataId();
    const repertoire = this.repertoireModel_.serializeForServer();
    this.server_.updateRepertoire(repertoireId, repertoire);
  }
}