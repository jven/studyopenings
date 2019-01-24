import { PickerController } from './pickercontroller';

export class ConfirmDeleteDialog {
  private pickerController_: PickerController;
  private dialogEl_: HTMLElement;
  private dialogNameEl_: HTMLElement;
  private okButton_: HTMLElement;

  constructor(
      pickerController: PickerController,
      dialogEl: HTMLElement,
      dialogNameEl: HTMLElement,
      okButton: HTMLElement,
      cancelButton: HTMLElement) {
    this.pickerController_ = pickerController;
    this.dialogEl_ = dialogEl;
    this.dialogNameEl_ = dialogNameEl;
    this.okButton_ = okButton;

    cancelButton.onclick = () => this.onCancelClick_();
  }

  isVisible(): boolean {
    return !this.dialogEl_.classList.contains('hidden');
  }

  showForRepertoire(
      repertoireId: string,
      repertoireName: string): void {
    this.dialogNameEl_.innerText = repertoireName;
    this.dialogEl_.classList.remove('hidden');

    this.okButton_.onclick = () => this.onOkClick_(repertoireId);
  }

  private onOkClick_(repertoireId: string): void {
    this.pickerController_.deleteMetadataId(repertoireId)
        .then(() => this.dialogEl_.classList.add('hidden'));
  }

  private onCancelClick_(): void {
    this.dialogEl_.classList.add('hidden');
  }
}
