import { ImpressionCode } from '../../../../protocol/impression/impressioncode';
import { Toasts } from '../../common/toasts';
import { ImpressionSender } from '../../impressions/impressionsender';
import { CurrentRepertoireImporter } from './currentrepertoireimporter';

export class ImportDialog {
  private impressionSender_: ImpressionSender;
  private dialogEl_: HTMLElement;
  private textAreaEl_: HTMLTextAreaElement;
  private uploadEl_: HTMLInputElement;
  private okButtonEl_: HTMLElement;
  private progressEl_: HTMLElement;
  private importer_: CurrentRepertoireImporter | null;

  constructor(
      impressionSender: ImpressionSender,
      dialogEl: HTMLElement,
      textAreaEl: HTMLTextAreaElement,
      uploadEl: HTMLInputElement,
      okButtonEl: HTMLElement,
      cancelButtonEl: HTMLElement,
      progressEl: HTMLElement) {
    this.impressionSender_ = impressionSender;
    this.dialogEl_ = dialogEl;
    this.textAreaEl_ = textAreaEl;
    this.uploadEl_ = uploadEl;
    this.okButtonEl_ = okButtonEl;
    this.progressEl_ = progressEl;
    this.importer_ = null;

    textAreaEl.oninput = () => this.onTextAreaInput_();
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
    this.hideProgress();
    this.dialogEl_.classList.remove('hidden');
    // Initialize the state of the OK button.
    this.onTextAreaInput_();
  }

  hide() {
    this.dialogEl_.classList.add('hidden');
  }

  showProgress(progressText: string): void {
    this.textAreaEl_.setAttribute('disabled', 'disabled');
    this.okButtonEl_.classList.add('disabled');
    this.okButtonEl_.classList.remove('selectable');
    this.progressEl_.classList.remove('hidden');
    this.progressEl_.innerText = progressText;
  }

  hideProgress(): void {
    this.textAreaEl_.removeAttribute('disabled');
    this.okButtonEl_.classList.remove('disabled');
    this.okButtonEl_.classList.add('selectable');
    this.progressEl_.classList.add('hidden');
  }

  private onTextAreaInput_(): void {
    const isTextAreaEmpty = !this.textAreaEl_.value;
    this.okButtonEl_.classList.toggle('disabled', isTextAreaEmpty);
    this.okButtonEl_.classList.toggle('selectable', !isTextAreaEmpty);
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
    };
    fileReader.onerror = () => {
      Toasts.error(
          'Couldn\'t load PGN file',
          `There was a problem loading '${fileToRead.name}'. Make sure this is `
              + 'a valid PGN file.');
    };
    fileReader.readAsText(fileToRead);
  }

  private onOkClick_(): void {
    if (!this.importer_) {
      throw new Error('No importer!');
    }
    if (!this.okButtonEl_.classList.contains('disabled')) {
      const pgnToImport = this.textAreaEl_.value;
      this.impressionSender_.sendImpression(
          ImpressionCode.START_PGN_IMPORT,
          {importedPgn: pgnToImport});
      this.importer_.startPgnImport(pgnToImport);
    }
  }

  private onCancelClick_(): void {
    if (!this.importer_) {
      throw new Error('No importer!');
    }
    this.importer_.cancelCurrentProgress();
    this.hide();
  }
}
