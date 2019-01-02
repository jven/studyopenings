import { ModeManager } from '../mode/modemanager';
import { PickerController } from './pickercontroller';
import { ServerWrapper } from '../common/serverwrapper';

export class PickerClickHandler {
  private server_: ServerWrapper;
  private controller_: PickerController;
  private modeManager_: ModeManager;

  constructor(
      server: ServerWrapper,
      controller: PickerController,
      modeManager: ModeManager) {
    this.server_ = server;
    this.controller_ = controller;
    this.modeManager_ = modeManager;
  }

  clickMetadata(metadataId: string) {
    if (this.controller_.getSelectedMetadataId() == metadataId) {
      // No-op if the clicked metadata is already selected.
      return;
    }
    this.controller_.selectMetadataId(metadataId);
    this.modeManager_.getSelectedMode().notifySelectedMetadata();
  }

  clickAddMetadataButton() {
    this.server_.createRepertoire().then(newRepertoireId => {
      this.controller_.updatePicker().then(() => {
        this.controller_.selectMetadataId(newRepertoireId);
        this.modeManager_.getSelectedMode().notifySelectedMetadata();
      })
    });
  }

  clickDeleteButton(metadataId: string) {
    const notifyMode = metadataId == this.controller_.getSelectedMetadataId();
    this.controller_.deleteMetadataId(metadataId).then(
        () => {
          if (notifyMode) {
            this.modeManager_.getSelectedMode().notifySelectedMetadata();
          }
        });
  }
}