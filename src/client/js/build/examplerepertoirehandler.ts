import { RepertoireModel } from '../common/repertoiremodel';
import { ExampleRepertoires } from './examplerepertoires';
import { RenameInput } from './renameinput';
import { ServerWrapper } from '../server/serverwrapper';
import { TreeView } from './treeview';
import { PickerController } from '../picker/pickercontroller';

export class ExampleRepertoireHandler {
  private repertoireModel_: RepertoireModel;
  private treeView_: TreeView;
  private server_: ServerWrapper;
  private pickerController_: PickerController;
  private renameInput_: RenameInput;

  constructor(
      repertoireModel: RepertoireModel,
      treeView: TreeView,
      server: ServerWrapper,
      pickerController: PickerController,
      renameInput: RenameInput) {
    this.repertoireModel_ = repertoireModel;
    this.treeView_ = treeView;
    this.server_ = server;
    this.pickerController_ = pickerController;
    this.renameInput_ = renameInput;
  }

  handleButtonClicks(exampleRepertoireElement: HTMLElement): void {
    exampleRepertoireElement.onclick = this.handleClick_.bind(this);
  }

  private handleClick_(): void {
    const exampleJson = JSON.parse(ExampleRepertoires.KINGS_GAMBIT);
    this.repertoireModel_.loadExample(exampleJson);
    this.treeView_.refresh();
    this.renameInput_.refresh();

    const repertoireId = this.pickerController_.getSelectedMetadataId();
    const repertoire = this.repertoireModel_.serializeForServer();
    this.server_.updateRepertoire(repertoireId, repertoire)
        .then(() => this.pickerController_.updatePicker());
  }
}