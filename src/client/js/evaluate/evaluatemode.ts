import { assert } from '../../../util/assert';
import { ChessgroundBoardFactory } from '../board/chessgroundboardfactory';
import { DelegatingBoard } from '../board/delegatingboard';
import { Mode } from '../mode/mode';
import { ModeManager } from '../mode/modemanager';
import { ModeType } from '../mode/modetype';
import { PickerController } from '../picker/pickercontroller';
import { ServerWrapper } from '../server/serverwrapper';
import { SoundToggler } from '../sound/soundtoggler';
import { TreeModel } from '../tree/treemodel';
import { EvaluateBoardHandler } from './evaluateboardhandler';

export class EvaluateMode implements Mode {
  private server_: ServerWrapper;
  private pickerController_: PickerController;
  private modeManager_: ModeManager;
  private soundToggler_: SoundToggler;

  private evaluateModeElement_: HTMLElement;
  private evaluateButton_: HTMLElement;

  private treeModel_: TreeModel;
  private board_: DelegatingBoard;

  constructor(
      server: ServerWrapper,
      pickerController: PickerController,
      modeManager: ModeManager,
      soundToggler: SoundToggler,
      chessgroundBoardHandler: ChessgroundBoardFactory) {
    this.server_ = server;
    this.pickerController_ = pickerController;
    this.modeManager_ = modeManager;
    this.soundToggler_ = soundToggler;

    this.evaluateModeElement_ = assert(document.getElementById('evaluateMode'));
    this.evaluateButton_ = assert(document.getElementById('evaluateButton'));
    this.evaluateButton_.onclick = () => this.modeManager_.selectModeType(
        ModeType.EVALUATE);

    this.treeModel_ = new TreeModel();
    this.board_ = new DelegatingBoard();
    chessgroundBoardHandler.createBoardAndSetDelegate(
        this.board_, 'evaluateBoard', new EvaluateBoardHandler());
  }

  preEnter(): Promise<void> {
    this.board_.setInitialPositionImmediately();
    return this.pickerController_.updatePicker()
        .then(() => this.notifySelectedMetadata());
  }

  exit(): Promise<void> {
    this.toggleEvaluteUi_(false);
    return Promise.resolve();
  }

  postEnter(): Promise<void> {
    this.toggleEvaluteUi_(true);
    this.board_.redraw();
    return Promise.resolve();
  }

  onKeyDown(e: KeyboardEvent): void {
    if (e.keyCode == 83) {
      this.modeManager_.selectModeType(ModeType.STUDY); // S
    } else if (e.keyCode == 66) {
      this.modeManager_.selectModeType(ModeType.BUILD); // B
    } else if (e.keyCode == 77) {
      this.soundToggler_.toggle(); // M
    }
  }

  notifySelectedMetadata(): Promise<void> {
    if (this.pickerController_.isModelEmpty()) {
      return Promise.resolve();
    }
    const selectedMetadataId = this.pickerController_.getSelectedMetadataId();
    return this.server_.loadRepertoire(selectedMetadataId)
        .then(repertoire => {
          this.treeModel_.loadRepertoire(repertoire);
        });
  }

  private toggleEvaluteUi_(enable: boolean): void {
    this.evaluateModeElement_.classList.toggle('hidden', !enable);
    this.evaluateButton_.classList.toggle('selectedMode', enable);
  }
}
