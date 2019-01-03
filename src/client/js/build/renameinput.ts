import { PickerController } from '../picker/pickercontroller';
import { RepertoireModel } from '../common/repertoiremodel';
import { ServerWrapper } from '../server/serverwrapper';

export class RenameInput {
  private renameInputElement_: HTMLInputElement;
  private repertoireModel_: RepertoireModel;
  private server_: ServerWrapper;
  private pickerController_: PickerController;

  constructor(
      renameInputElement: HTMLInputElement,
      repertoireModel: RepertoireModel,
      server: ServerWrapper,
      pickerController: PickerController) {
    this.renameInputElement_ = renameInputElement;
    this.repertoireModel_ = repertoireModel;
    this.server_ = server;
    this.pickerController_ = pickerController;

    this.renameInputElement_.oninput = () => this.onInputChange_();
  }

  isFocused(): boolean {
    return this.renameInputElement_ == document.activeElement;
  }

  refresh(): void {
    this.renameInputElement_.value = this.repertoireModel_.getRepertoireName();
  }

  private onInputChange_(): void {
    this.repertoireModel_.setRepertoireName(this.renameInputElement_.value);
    
    const repertoireId = this.pickerController_.getSelectedMetadataId();
    const repertoire = this.repertoireModel_.serializeForServer();
    this.server_.updateRepertoire(repertoireId, repertoire)
        .then(() => this.pickerController_.updatePicker());
  }
}