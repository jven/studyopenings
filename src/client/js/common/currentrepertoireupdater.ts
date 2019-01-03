import { ServerWrapper } from "../server/serverwrapper";
import { PickerController } from "../picker/pickercontroller";
import { RepertoireModel } from "./repertoiremodel";

export class CurrentRepertoireUpdater {
  private server_: ServerWrapper;
  private pickerController_: PickerController;
  private repertoireModel_: RepertoireModel;

  constructor(
      server: ServerWrapper,
      pickerController: PickerController,
      repertoireModel: RepertoireModel) {
    this.server_ = server;
    this.pickerController_ = pickerController;
    this.repertoireModel_ = repertoireModel;
  }

  updateCurrentRepertoire(): Promise<void> {
    const repertoireId = this.pickerController_.getSelectedMetadataId();
    const repertoire = this.repertoireModel_.serializeForServer();
    return this.server_.updateRepertoire(repertoireId, repertoire);
  }
}