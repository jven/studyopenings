import { ServerWrapper } from '../server/serverwrapper';
import { PickerController } from '../picker/pickercontroller';
import { TreeModel } from '../tree/treemodel';

export class CurrentRepertoireUpdater {
  private server_: ServerWrapper;
  private pickerController_: PickerController;
  private treeModel_: TreeModel;

  constructor(
      server: ServerWrapper,
      pickerController: PickerController,
      treeModel: TreeModel) {
    this.server_ = server;
    this.pickerController_ = pickerController;
    this.treeModel_ = treeModel;
  }

  updateCurrentRepertoire(): Promise<void> {
    const repertoireId = this.pickerController_.getSelectedMetadataId();
    const repertoire = this.treeModel_.serializeAsRepertoire();
    return this.server_.updateRepertoire(repertoireId, repertoire);
  }
}