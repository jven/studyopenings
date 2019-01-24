import { PickerController } from '../picker/pickercontroller';
import { ServerWrapper } from '../server/serverwrapper';

export class PrivelegedCopyDialog {
  private server_: ServerWrapper;
  private pickerController_: PickerController;
  private dialogEl_: HTMLElement;
  private inputEl_: HTMLInputElement;

  constructor(
      server: ServerWrapper,
      pickerController: PickerController,
      dialogEl: HTMLElement,
      inputEl: HTMLInputElement) {
    this.server_ = server;
    this.pickerController_ = pickerController;
    this.dialogEl_ = dialogEl;
    this.inputEl_ = inputEl;
  }

  bindButtons(
      okButton: HTMLElement,
      cancelButton: HTMLElement): void {
    okButton.onclick = () => this.onOkClick_();
    cancelButton.onclick = () => this.hide();
  }

  show(): void {
    this.dialogEl_.classList.remove('hidden');
  }

  hide(): void {
    this.dialogEl_.classList.add('hidden');
  }

  isVisible(): boolean {
    return !this.dialogEl_.classList.contains('hidden');
  }

  onKeyDown(e: KeyboardEvent): void {
    if (e.keyCode == 13) {
      this.onOkClick_(); // Enter
    } else if (e.keyCode == 27) {
      this.hide(); // Esc
    }
  }

  private onOkClick_(): void {
    this.server_.copyRepertoireAsPrivelegedUser(this.inputEl_.value).then(
        () => {
          this.hide();
          this.pickerController_.updatePicker();
        });
  }
}
