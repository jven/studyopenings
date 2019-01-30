import { ImpressionCode } from '../../../protocol/impression/impressioncode';
import { Repertoire } from '../../../protocol/storage';
import { assert } from '../../../util/assert';
import { ChessgroundBoardFactory } from '../board/chessgroundboardfactory';
import { DelegatingBoard } from '../board/delegatingboard';
import { ImpressionSender } from '../impressions/impressionsender';
import { Mode } from '../mode/mode';
import { ModeManager } from '../mode/modemanager';
import { ModeType } from '../mode/modetype';
import { PickerController } from '../picker/pickercontroller';
import { ServerWrapper } from '../server/serverwrapper';
import { SoundToggler } from '../sound/soundtoggler';
import { DebouncingStatisticRecorder } from '../statistics/debouncingstatisticsrecorder';
import { TreeModel } from '../tree/treemodel';
import { LineEmitter } from './lineemitter';
import { LineListStudier } from './lineliststudier';
import { LineStudier } from './linestudier';
import { StudyBoardHandler } from './studyboardhandler';

export class StudyMode implements Mode {
  private impressionSender_: ImpressionSender;
  private server_: ServerWrapper;
  private pickerController_: PickerController;
  private modeManager_: ModeManager;
  private soundToggler_: SoundToggler;
  private treeModel_: TreeModel;
  private lineListStudier_: LineListStudier;
  private board_: DelegatingBoard;
  private studyModeElement_: HTMLElement;
  private studyButton_: HTMLElement;

  constructor(
      impressionSender: ImpressionSender,
      server: ServerWrapper,
      pickerController: PickerController,
      modeManager: ModeManager,
      soundToggler: SoundToggler,
      chessgroundBoardFactory: ChessgroundBoardFactory) {
    this.impressionSender_ = impressionSender;
    this.server_ = server;
    this.pickerController_ = pickerController;
    this.modeManager_ = modeManager;
    this.soundToggler_ = soundToggler;
    this.treeModel_ = new TreeModel();

    const statisticRecorder = new DebouncingStatisticRecorder(
        pickerController, server, 10000 /* debounceIntervalMs */);

    this.board_ = new DelegatingBoard();
    const lineStudier = new LineStudier(
        statisticRecorder, impressionSender, this.board_);
    this.lineListStudier_ = new LineListStudier(
        lineStudier,
        assert(document.getElementById('studyMessage')));

    const handler = new StudyBoardHandler(lineStudier);
    chessgroundBoardFactory.createBoardAndSetDelegate(
        this.board_, 'studyBoard', handler);

    this.studyModeElement_ = assert(document.getElementById('studyMode'));
    this.studyButton_ = assert(document.getElementById('studyButton'));

    this.studyButton_.onclick = this.modeManager_.selectModeType.bind(
        this.modeManager_, ModeType.STUDY);
  }

  preEnter(): Promise<void> {
    this.board_.setInitialPositionImmediately();
    return this.pickerController_
        .updatePicker()
        .then(() => this.notifySelectedMetadata());
  }

  exit(): Promise<void> {
    this.studyModeElement_.classList.add('hidden');
    this.studyButton_.classList.remove('selectedMode');
    return Promise.resolve();
  }

  postEnter(): Promise<void> {
    this.impressionSender_.sendImpression(ImpressionCode.ENTER_STUDY_MODE);
    this.studyModeElement_.classList.remove('hidden');
    this.studyButton_.classList.add('selectedMode');
    this.board_.redraw();
    return Promise.resolve();
  }

  onKeyDown(e: KeyboardEvent): void {
    if (e.keyCode == 66) {
      this.modeManager_.selectModeType(ModeType.BUILD); // B
    } else if (e.keyCode == 69) {
      this.modeManager_.selectModeType(ModeType.EVALUATE); // E
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
        .then(repertoire => this.onLoadRepertoire_(repertoire));
  }

  private onLoadRepertoire_(repertoire: Repertoire): void {
    this.treeModel_.loadRepertoire(repertoire);
    this.board_.setInitialPositionImmediately();
    this.board_.setOrientationForColor(
        this.treeModel_.getRepertoireColor());

    const emptyStudyElement = assert(document.getElementById('emptyStudy'));
    const studyMessage = assert(document.getElementById('studyMessage'));
    if (this.treeModel_.isEmpty()) {
      emptyStudyElement.classList.remove('hidden');
      studyMessage.classList.add('hidden');
      this.lineListStudier_.cancelStudy();
      return;
    }

    emptyStudyElement.classList.add('hidden');
    const lines = LineEmitter.emitForModel(this.treeModel_);
    this.lineListStudier_.study(lines);
  }
}
