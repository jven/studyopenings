import { ModeManager } from '../mode/modemanager';
import { PickerController } from './pickercontroller';

export class PickerClickHandler {
  private controller_: PickerController;
  private modeManager_: ModeManager;

  constructor(controller: PickerController, modeManager: ModeManager) {
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
    
  }
}