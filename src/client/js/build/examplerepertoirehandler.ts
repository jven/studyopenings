import { RepertoireModel } from '../common/repertoiremodel';
import { ExampleRepertoires } from './examplerepertoires';
import { RenameInput } from './renameinput';
import { TreeView } from './treeview';
import { PickerController } from '../picker/pickercontroller';
import { CurrentRepertoireUpdater } from '../common/currentrepertoireupdater';

export class ExampleRepertoireHandler {
  private repertoireModel_: RepertoireModel;
  private treeView_: TreeView;
  private pickerController_: PickerController;
  private updater_: CurrentRepertoireUpdater;
  private renameInput_: RenameInput;

  constructor(
      repertoireModel: RepertoireModel,
      treeView: TreeView,
      pickerController: PickerController,
      updater: CurrentRepertoireUpdater,
      renameInput: RenameInput) {
    this.repertoireModel_ = repertoireModel;
    this.treeView_ = treeView;
    this.pickerController_ = pickerController;
    this.updater_ = updater;
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

    this.updater_.updateCurrentRepertoire()
        .then(() => this.pickerController_.updatePicker());
  }
}