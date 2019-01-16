import { ImpressionCode } from '../../../protocol/impression/impressioncode';
import { ImpressionSender } from '../../impressions/impressionsender';
import { PickerController } from '../picker/pickercontroller';
import { TreeModel } from '../tree/treemodel';
import { CurrentRepertoireUpdater } from './currentrepertoireupdater';
import { ExampleRepertoires } from './examplerepertoires';
import { RenameInput } from './renameinput';
import { TreeView } from './treeview';

export class ExampleRepertoireHandler {
  private impressionSender_: ImpressionSender;
  private treeModel_: TreeModel;
  private treeView_: TreeView;
  private pickerController_: PickerController;
  private updater_: CurrentRepertoireUpdater;
  private renameInput_: RenameInput;

  constructor(
      impressionSender: ImpressionSender,
      treeModel: TreeModel,
      treeView: TreeView,
      pickerController: PickerController,
      updater: CurrentRepertoireUpdater,
      renameInput: RenameInput) {
    this.impressionSender_ = impressionSender;
    this.treeModel_ = treeModel;
    this.treeView_ = treeView;
    this.pickerController_ = pickerController;
    this.updater_ = updater;
    this.renameInput_ = renameInput;
  }

  handleButtonClicks(exampleRepertoireElement: HTMLElement): void {
    exampleRepertoireElement.onclick = this.handleClick_.bind(this);
  }

  private handleClick_(): void {
    this.impressionSender_.sendImpression(
        ImpressionCode.LOAD_EXAMPLE_REPERTOIRE);
    const exampleJson = JSON.parse(ExampleRepertoires.KINGS_GAMBIT);
    this.treeModel_.loadRepertoire(exampleJson);
    this.treeView_.refresh();
    this.renameInput_.refresh();

    this.updater_.updateCurrentRepertoire()
        .then(() => this.pickerController_.updatePicker());
  }
}
