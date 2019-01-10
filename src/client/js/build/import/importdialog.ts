import { ReadPreference } from "mongodb";
import { Toasts } from "../../common/toasts";
import { CurrentRepertoireImporter } from "./currentrepertoireimporter";

export class ImportDialog {
  private importer_: CurrentRepertoireImporter;
  private dialogEl_: HTMLElement;
  private textAreaEl_: HTMLTextAreaElement;
  private uploadEl_: HTMLInputElement;

  constructor(
      importer: CurrentRepertoireImporter,
      dialogEl: HTMLElement,
      textAreaEl: HTMLTextAreaElement,
      uploadEl: HTMLInputElement,
      okButtonEl: HTMLElement,
      cancelButtonEl: HTMLElement) {
    this.importer_ = importer;
    this.dialogEl_ = dialogEl;
    this.textAreaEl_ = textAreaEl;
    this.uploadEl_ = uploadEl;

    uploadEl.onchange = () => this.onUpload_();
    okButtonEl.onclick = () => this.onOkClick_();
    cancelButtonEl.onclick = () => this.onCancelClick_();
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
    try {
      this.importer_.importPgn(this.textAreaEl_.value);
      this.hide();
    } catch (e) {
      let errorMessage;
      if (e.location && e.location.start) {
        const errLoc = e.location.start;
        errorMessage =
            `Line ${errLoc.line}, column ${errLoc.column}: ${e.message}`;
      } else {
        errorMessage = e;
      }

      Toasts.error('Error parsing PGN', errorMessage);
    }
  }

  private onCancelClick_(): void {
    this.hide();
  }
}