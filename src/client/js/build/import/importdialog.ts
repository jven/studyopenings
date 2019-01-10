import { ReadPreference } from "mongodb";
import { Toasts } from "../../common/toasts";
import { CurrentRepertoireImporter } from "./currentrepertoireimporter";

export class ImportDialog {
  private dialogEl_: HTMLElement;
  private textAreaEl_: HTMLTextAreaElement;
  private uploadEl_: HTMLInputElement;
  private importer_: CurrentRepertoireImporter | null;

  constructor(
      dialogEl: HTMLElement,
      textAreaEl: HTMLTextAreaElement,
      uploadEl: HTMLInputElement,
      okButtonEl: HTMLElement,
      cancelButtonEl: HTMLElement) {
    this.dialogEl_ = dialogEl;
    this.textAreaEl_ = textAreaEl;
    this.uploadEl_ = uploadEl;
    this.importer_ = null;

    uploadEl.onchange = () => this.onUpload_();
    okButtonEl.onclick = () => this.onOkClick_();
    cancelButtonEl.onclick = () => this.onCancelClick_();
  }

  setImporter(importer: CurrentRepertoireImporter): void {
    this.importer_ = importer;
  }

  isVisible(): boolean {
    return !this.dialogEl_.classList.contains('hidden');
  }

  show() {
    this.dialogEl_.classList.remove('hidden');
  }

  hide() {
    this.dialogEl_.classList.add('hidden');
  }

  private onUpload_(): void {
    const files = this.uploadEl_.files;
    if (!files || !files.length) {
      return;
    }
    
    const fileToRead = files[0];
    const fileReader = new FileReader();
    fileReader.onload = (readEvent: any) => {
      this.textAreaEl_.value = readEvent.target.result;
    }
    fileReader.onerror = () => {
      Toasts.error(
          'Couldn\'t load PGN file',
          `There was a problem loading '${fileToRead.name}'. Make sure this is `
              + 'a valid PGN file.');
    }
    fileReader.readAsText(fileToRead);
  }

  private onOkClick_(): void {
    if (!this.importer_) {
      throw new Error('No importer!');
    }
    this.importer_.startPgnImport(this.textAreaEl_.value);
  }

  private onCancelClick_(): void {
    this.hide();
  }
}