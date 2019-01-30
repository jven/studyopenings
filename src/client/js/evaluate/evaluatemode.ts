import { assert } from '../../../util/assert';
import { NoOpAnnotationRenderer } from '../annotation/noopannotationrenderer';
import { NullAnnotator } from '../annotation/nullannotator';
import { ChessgroundBoardFactory } from '../board/chessgroundboardfactory';
import { DelegatingBoard } from '../board/delegatingboard';
import { ListRefreshableView } from '../common/listrefreshableview';
import { ImpressionSender } from '../impressions/impressionsender';
import { Mode } from '../mode/mode';
import { ModeManager } from '../mode/modemanager';
import { ModeType } from '../mode/modetype';
import { PickerController } from '../picker/pickercontroller';
import { ServerWrapper } from '../server/serverwrapper';
import { SoundToggler } from '../sound/soundtoggler';
import { TreeModel } from '../tree/treemodel';
import { TreeNodeHandler } from '../tree/treenodehandler';
import { TreeView } from '../tree/treeview';
import { EvaluateBoardHandler } from './evaluateboardhandler';

export class EvaluateMode implements Mode {
  private server_: ServerWrapper;
  private pickerController_: PickerController;
  private modeManager_: ModeManager;
  private soundToggler_: SoundToggler;

  private evaluateModeElement_: HTMLElement;
  private evaluateButton_: HTMLElement;

  private modeView_: ListRefreshableView;
  private treeModel_: TreeModel;
  private board_: DelegatingBoard;
  private treeView_: TreeView;

  constructor(
      impressionSender: ImpressionSender,
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

    this.modeView_ = new ListRefreshableView();
    this.treeModel_ = new TreeModel();
    this.board_ = new DelegatingBoard();
    chessgroundBoardHandler.createBoardAndSetDelegate(
        this.board_,
        'evaluateBoard',
        new EvaluateBoardHandler(),
        true /* viewOnly */);
    this.treeView_ = new TreeView(
        assert(document.getElementById('evaluateTreeViewInner')),
        assert(document.getElementById('evaluateTreeViewOuter')),
        this.treeModel_,
        new TreeNodeHandler(impressionSender, this.treeModel_, this.modeView_),
        this.board_,
        NullAnnotator.INSTANCE,
        new NoOpAnnotationRenderer());
    this.modeView_.addView(this.treeView_);
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
          this.modeView_.refresh();
        });
  }

  private toggleEvaluteUi_(enable: boolean): void {
    this.evaluateModeElement_.classList.toggle('hidden', !enable);
    this.evaluateButton_.classList.toggle('selectedMode', enable);
  }
}
