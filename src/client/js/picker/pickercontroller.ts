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

  updatePicker(): Promise<void> {
    if (!this.model_ || !this.view_) {
      return Promise.reject('Not initialized yet.');
    }

    return this.server_.getAllRepertoireMetadata()
        .then(this.onMetadataJson_.bind(this));
  }

  private onMetadataJson_(metadataList: MetadataJson[]): void {
    if (!this.model_ || !this.view_) {
      return;
    }

    metadataList.forEach(m => {
      if (!m.id || !m.name) {
        throw new Error('Metadata JSON found without ID and name.');
      }
    });

    this.model_.setMetadataList(metadataList);
    this.view_.refresh();
  }
}