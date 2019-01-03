import { Move } from '../common/move';
import { RepertoireModel } from '../common/repertoiremodel';
import { TreeView } from './treeview';
import { ServerWrapper } from '../server/serverwrapper';
import { PickerController } from '../picker/pickercontroller';

export class ChessBoardBuildHandler {
  private repertoireModel_: RepertoireModel;
  private treeView_: TreeView;
  private server_: ServerWrapper;
  private pickerController_: PickerController;

  constructor(
      repertoireModel: RepertoireModel,
      treeView: TreeView,
      server: ServerWrapper,
      pickerController: PickerController) {
    this.repertoireModel_ = repertoireModel;
    this.treeView_ = treeView;
    this.server_ = server;
    this.pickerController_ = pickerController;
  }

  onMove(fromSquare: string, toSquare: string): void {
    var pgn = this.repertoireModel_.getSelectedViewInfo().pgn;
    this.repertoireModel_.addMove(pgn, new Move(fromSquare, toSquare));

    const repertoireId = this.pickerController_.getSelectedMetadataId();
    const repertoire = this.repertoireModel_.serializeForServer();
    this.server_.updateRepertoire(repertoireId, repertoire);
  }

  onChange(): void {
    this.treeView_.refresh();
  }
}