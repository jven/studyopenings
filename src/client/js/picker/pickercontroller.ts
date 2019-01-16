import { ImpressionCode } from '../../../protocol/impression/impressioncode';
import { Metadata } from '../../../protocol/storage';
import { ImpressionSender } from '../impressions/impressionsender';
import { ModeManager } from '../mode/modemanager';
import { PickerModel } from '../picker/pickermodel';
import { PickerView } from '../picker/pickerview';
import { ServerWrapper } from '../server/serverwrapper';

export class PickerController {
  private impressionSender_: ImpressionSender;
  private server_: ServerWrapper;
  private modeManager_: ModeManager;
  private model_: PickerModel | null;
  private view_: PickerView | null;

  constructor(
      impressionSender: ImpressionSender,
      server: ServerWrapper,
      modeManager: ModeManager) {
    this.impressionSender_ = impressionSender;
    this.server_ = server;
    this.modeManager_ = modeManager;
    this.model_ = null;
    this.view_ = null;
  }

  initialize(model: PickerModel, view: PickerView) {
    this.model_ = model;
    this.view_ = view;
  }

  addMetadata(): Promise<void> {
    this.impressionSender_.sendImpression(ImpressionCode.PICKER_NEW_REPERTOIRE);
    return this.server_.createRepertoire().then(newRepertoireId => {
      this.updatePicker().then(() => {
        this.selectMetadataId(newRepertoireId);
        this.modeManager_.getSelectedMode().notifySelectedMetadata();
      });
    });
  }

  selectMetadataId(metadataId: string): void {
    if (!this.model_ || !this.view_) {
      throw new Error('Not initialized yet.');
    }
    if (this.model_.getSelectedMetadata().id == metadataId) {
      // No-op if the clicked metadata is already selected.
      return;
    }
    this.impressionSender_.sendImpression(
        ImpressionCode.PICKER_SELECT_REPERTOIRE);
    this.model_.selectMetadataId(metadataId);
    this.view_.refresh();
    this.modeManager_.getSelectedMode().notifySelectedMetadata();
  }

  deleteMetadataId(metadataId: string): Promise<void> {
    if (!this.model_ || !this.view_) {
      throw new Error('Not initialized yet.');
    }

    this.impressionSender_.sendImpression(
        ImpressionCode.PICKER_DELETE_REPERTOIRE);
    const notifyMode = metadataId == this.getSelectedMetadataId();
    return this.server_.deleteRepertoire(metadataId)
        .then(() => this.updatePicker())
        .then(() => {
          if (notifyMode) {
            this.modeManager_.getSelectedMode().notifySelectedMetadata();
          }
        });
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
        // If there are no repertoires, create a new one first.
        .then(metadataList => !metadataList.length
            ? this.addMetadata()
                .then(() => this.server_.getAllRepertoireMetadata())
            : Promise.resolve(metadataList))
        .then(metadataList => this.populatePicker_(
            lastSelectedMetadataId, metadataList));
  }

  private populatePicker_(
      lastSelectedMetadataId: string | null,
      metadataList: Metadata[]): void {
    if (!this.model_ || !this.view_) {
      throw new Error('Not initialized yet.');
    }

    this.model_.setMetadataList(metadataList, lastSelectedMetadataId);
    this.view_.refresh();
  }
}
