import { MetadataJson } from '../../../protocol/protocol';
import { PickerModel } from '../picker/pickermodel';
import { PickerView } from '../picker/pickerview';
import { ServerWrapper } from '../common/serverwrapper';

export class PickerController {
  private server_: ServerWrapper;
  private model_: PickerModel | null;
  private view_: PickerView | null;

  constructor(server: ServerWrapper) {
    this.server_ = server;
    this.model_ = null;
    this.view_ = null;
  }

  initialize(model: PickerModel, view: PickerView) {
    this.model_ = model;
    this.view_ = view;
  }

  selectMetadataId(metadataId: string) {
    if (!this.model_ || !this.view_) {
      throw new Error('Not initialized yet.');
    }
    this.model_.selectMetadataId(metadataId);
    this.view_.refresh();
  }

  getSelectedMetadataId(): string {
    if (!this.model_) {
      throw new Error('Not initialized yet.');
    }
    return this.model_.getSelectedMetadata().id;
  }

  updatePicker(): Promise<void> {
    if (!this.model_ || !this.view_) {
      throw new Error('Not initialized yet.');
    }

    return this.server_.getAllRepertoireMetadata()
        .then(this.onMetadataJson_.bind(this));
  }

  private onMetadataJson_(metadataList: MetadataJson[]): void {
    if (!this.model_ || !this.view_) {
      throw new Error('Not initialized yet.');
    }

    metadataList.forEach(m => {
      if (!m.id || !m.name) {
        throw new Error('Metadata JSON found without ID and name.');
      }
    });

    this.model_.setMetadataList(metadataList, null /* selectedMetadataId */);
    this.view_.refresh();
  }
}