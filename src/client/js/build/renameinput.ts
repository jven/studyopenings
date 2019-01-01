import { PickerController } from '../picker/pickercontroller';
import { RepertoireModel } from '../common/repertoiremodel';

export class RenameInput {
  private renameInputElement_: HTMLInputElement;
  private repertoireModel_: RepertoireModel;
  private pickerController_: PickerController;

  constructor(
      renameInputElement: HTMLInputElement,
      repertoireModel: RepertoireModel,
      pickerController: PickerController) {
    this.renameInputElement_ = renameInputElement;
    this.repertoireModel_ = repertoireModel;
    this.pickerController_ = pickerController;

    this.renameInputElement_.oninput = () => this.onInputChange_();
  }

  isFocused(): boolean {
    return this.renameInputElement_ == document.activeElement;
  }

  refresh(): void {
    this.renameInputElement_.value = this.repertoireModel_.getRepertoireName();
  }

  private onInputChange_(): void {
    this.repertoireModel_
        .setRepertoireName(this.renameInputElement_.value)
        .then(() => this.pickerController_.updatePicker());
  }
}