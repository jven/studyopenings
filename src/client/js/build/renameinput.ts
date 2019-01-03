import { PickerController } from '../picker/pickercontroller';
import { RepertoireModel } from '../tree/repertoiremodel';
import { CurrentRepertoireUpdater } from '../common/currentrepertoireupdater';

export class RenameInput {
  private renameInputElement_: HTMLInputElement;
  private repertoireModel_: RepertoireModel;
  private pickerController_: PickerController;
  private updater_: CurrentRepertoireUpdater;

  constructor(
      renameInputElement: HTMLInputElement,
      repertoireModel: RepertoireModel,
      pickerController: PickerController,
      updater: CurrentRepertoireUpdater) {
    this.renameInputElement_ = renameInputElement;
    this.repertoireModel_ = repertoireModel;
    this.pickerController_ = pickerController;
    this.updater_ = updater;

    this.renameInputElement_.oninput = () => this.onInputChange_();
  }

  isFocused(): boolean {
    return this.renameInputElement_ == document.activeElement;
  }

  refresh(): void {
    this.renameInputElement_.value = this.repertoireModel_.getRepertoireName();
  }

  private onInputChange_(): void {
    if (!this.renameInputElement_.value) {
      this.renameInputElement_.value = 'Untitled repertoire';
    }

    this.repertoireModel_.setRepertoireName(this.renameInputElement_.value);
    this.updater_.updateCurrentRepertoire()
        .then(() => this.pickerController_.updatePicker());
  }
}