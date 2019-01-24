import { PickerController } from './pickercontroller';

export class ConfirmDeleteDialog {
  private pickerController_: PickerController;
  private dialogEl_: HTMLElement;
  private dialogNameEl_: HTMLElement;
  private okButton_: HTMLElement;
  private repertoireIdToDelete_: string;

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
    this.repertoireIdToDelete_ = '';

    cancelButton.onclick = () => this.hide_();
  }

  isVisible(): boolean {
    return !this.dialogEl_.classList.contains('hidden');
  }

  showForRepertoire(
      repertoireId: string,
      repertoireName: string): void {
    this.dialogNameEl_.innerText = repertoireName;
    this.dialogEl_.classList.remove('hidden');
    this.repertoireIdToDelete_ = repertoireId;
    this.okButton_.onclick = () => this.onOkClick_();
  }

  onKeyDown(e: KeyboardEvent): void {
    if (e.keyCode == 27) {
      this.hide_(); // Esc
    }
  }

  private onOkClick_(): void {
    this.pickerController_.deleteMetadataId(this.repertoireIdToDelete_)
        .then(() => this.hide_());
  }

  private hide_(): void {
    this.dialogEl_.classList.add('hidden');
  }
}
