import { PickerController } from '../picker/pickercontroller';
import { CurrentRepertoireUpdater } from '../common/currentrepertoireupdater';
import { TreeModel } from '../tree/treemodel';

export class RenameInput {
  private renameInputElement_: HTMLInputElement;
  private treeModel_: TreeModel;
  private pickerController_: PickerController;
  private updater_: CurrentRepertoireUpdater;

  constructor(
      renameInputElement: HTMLInputElement,
      treeModel: TreeModel,
      pickerController: PickerController,
      updater: CurrentRepertoireUpdater) {
    this.renameInputElement_ = renameInputElement;
    this.treeModel_ = treeModel;
    this.pickerController_ = pickerController;
    this.updater_ = updater;

    this.renameInputElement_.oninput = () => this.onInputChange_();
  }

  isFocused(): boolean {
    return this.renameInputElement_ == document.activeElement;
  }

  refresh(): void {
    this.renameInputElement_.value = this.treeModel_.getRepertoireName();
  }

  private onInputChange_(): void {
    if (!this.renameInputElement_.value) {
      this.renameInputElement_.value = 'Untitled repertoire';
    }

    this.treeModel_.setRepertoireName(this.renameInputElement_.value);
    this.updater_.updateCurrentRepertoire()
        .then(() => this.pickerController_.updatePicker());
  }
}