import { Metadata } from '../../../protocol/storage';
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

  deleteMetadataId(metadataId: string): Promise<void> {
    if (!this.model_ || !this.view_) {
      throw new Error('Not initialized yet.');
    }
    
    return this.server_.deleteRepertoire(metadataId)
        .then(() => this.updatePicker());
  }

  isModelEmpty(): boolean {
    if (!this.model_) {
      throw new Error('Not initialized yet.');
    }
    return this.model_.isEmpty();
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

    const lastSelectedMetadataId = this.model_.isEmpty()
        ? null
        : this.model_.getSelectedMetadata().id;
    return this.server_.getAllRepertoireMetadata()
        .then(metadataList => this.populatePicker_(
            lastSelectedMetadataId, metadataList));
  }

  private populatePicker_(
      lastSelectedMetadataId: string | null,
      metadataList: Metadata[]): void {
    if (!this.model_ || !this.view_) {
      throw new Error('Not initialized yet.');
    }

    metadataList.forEach(m => {
      if (!m.id || !m.name) {
        throw new Error('Metadata JSON found without ID and name.');
      }
    });

    this.model_.setMetadataList(metadataList, lastSelectedMetadataId);
    this.view_.refresh();
  }
}