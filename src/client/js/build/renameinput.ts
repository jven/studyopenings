import { Debouncer } from '../common/debouncer';
import { RefreshableView } from '../common/refreshableview';
import { PickerController } from '../picker/pickercontroller';
import { TreeModel } from '../tree/treemodel';
import { CurrentRepertoireUpdater } from './currentrepertoireupdater';

const UPDATE_DEBOUNCE_INTERVAL_MS_: number = 1000;

export class RenameInput implements RefreshableView {
  private renameInputElement_: HTMLInputElement;
  private treeModel_: TreeModel;
  private pickerController_: PickerController;
  private updater_: CurrentRepertoireUpdater;
  private updateDebouncer_: Debouncer;

  constructor(
      renameInputElement: HTMLInputElement,
      treeModel: TreeModel,
      pickerController: PickerController,
      updater: CurrentRepertoireUpdater) {
    this.renameInputElement_ = renameInputElement;
    this.treeModel_ = treeModel;
    this.pickerController_ = pickerController;
    this.updater_ = updater;
    this.updateDebouncer_ = new Debouncer(
        () => this.update_(), UPDATE_DEBOUNCE_INTERVAL_MS_);

    this.renameInputElement_.oninput = () => this.onInputChange_();
  }

  refresh(): void {
    this.renameInputElement_.value = this.treeModel_.getRepertoireName();
  }

  isFocused(): boolean {
    return this.renameInputElement_ == document.activeElement;
  }

  private onInputChange_(): void {
    if (!this.renameInputElement_.value) {
      this.renameInputElement_.value = 'Untitled repertoire';
    }

    this.treeModel_.setRepertoireName(this.renameInputElement_.value);
    this.updateDebouncer_.fire();
  }

  private update_(): void {
    this.updater_.updateCurrentRepertoire()
        .then(() => this.pickerController_.updatePicker());
  }
}
