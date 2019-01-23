import { Chessground } from 'chessground';
import { FlagName } from '../../../flag/flags';
import { EvaluatedFlags } from '../../../protocol/evaluatedflags';
import { ImpressionCode } from '../../../protocol/impression/impressioncode';
import { Repertoire } from '../../../protocol/storage';
import { assert } from '../../../util/assert';
import { ChessBoardWrapper } from '../common/chessboardwrapper';
import { ImpressionSender } from '../impressions/impressionsender';
import { Mode } from '../mode/mode';
import { ModeManager } from '../mode/modemanager';
import { ModeType } from '../mode/modetype';
import { PickerController } from '../picker/pickercontroller';
import { ServerWrapper } from '../server/serverwrapper';
import { SoundPlayer } from '../sound/soundplayer';
import { SoundToggler } from '../sound/soundtoggler';
import { DebouncingStatisticRecorder } from '../statistics/debouncingstatisticsrecorder';
import { NoOpStatisticRecorder } from '../statistics/noopstatisticrecorder';
import { TreeModel } from '../tree/treemodel';
import { ChessBoardStudyHandler } from './chessboardstudyhandler';
import { LineEmitter } from './lineemitter';
import { LineIterator } from './lineiterator';
import { LineIteratorStudier } from './lineiteratorstudier';
import { LineStudier } from './linestudier';

export class StudyMode implements Mode {
  private impressionSender_: ImpressionSender;
  private server_: ServerWrapper;
  private pickerController_: PickerController;
  private modeManager_: ModeManager;
  private soundToggler_: SoundToggler;
  private treeModel_: TreeModel;
  private chessBoardWrapper_: ChessBoardWrapper;
  private lineIteratorStudier_: LineIteratorStudier;
  private studyModeElement_: HTMLElement;
  private studyButton_: HTMLElement;

  constructor(
      flags: EvaluatedFlags,
      impressionSender: ImpressionSender,
      server: ServerWrapper,
      pickerController: PickerController,
      modeManager: ModeManager,
      soundToggler: SoundToggler,
      soundPlayer: SoundPlayer) {
    this.impressionSender_ = impressionSender;
    this.server_ = server;
    this.pickerController_ = pickerController;
    this.modeManager_ = modeManager;
    this.soundToggler_ = soundToggler;
    this.treeModel_ = new TreeModel();

    const statisticRecorder = flags[FlagName.ENABLE_RECORDING_STATISTICS]
        ? new DebouncingStatisticRecorder(
            pickerController, server, 10000 /* debounceIntervalMs */)
        : new NoOpStatisticRecorder();

    this.chessBoardWrapper_ = new ChessBoardWrapper(soundPlayer);
    const lineStudier = new LineStudier(
        statisticRecorder, impressionSender, this.chessBoardWrapper_);
    this.lineIteratorStudier_ = new LineIteratorStudier(lineStudier);
    const handler = new ChessBoardStudyHandler(lineStudier);

    const studyBoardElement = assert(document.getElementById('studyBoard'));
    const chessBoard = Chessground(studyBoardElement, {
      movable: {
        free: false
      },
      events: {
        move: handler.onMove.bind(handler)
      }
    });
    $(window).resize(
        this.chessBoardWrapper_.redraw.bind(this.chessBoardWrapper_));
    this.chessBoardWrapper_.setChessBoard(chessBoard, studyBoardElement);

    this.studyModeElement_ = assert(document.getElementById('studyMode'));
    this.studyButton_ = assert(document.getElementById('studyButton'));

    this.studyButton_.onclick = this.modeManager_.selectModeType.bind(
        this.modeManager_, ModeType.STUDY);
  }

  preEnter(): Promise<void> {
    this.chessBoardWrapper_.setInitialPositionImmediately();
    return this.pickerController_
        .updatePicker()
        .then(() => this.notifySelectedMetadata());
  }

  exit(): Promise<void> {
    this.studyModeElement_.classList.add('hidden');
    this.studyButton_.classList.remove('selectedButton');
    return Promise.resolve();
  }

  postEnter(): Promise<void> {
    this.impressionSender_.sendImpression(ImpressionCode.ENTER_STUDY_MODE);
    this.studyModeElement_.classList.remove('hidden');
    this.studyButton_.classList.add('selectedButton');
    this.chessBoardWrapper_.redraw();
    return Promise.resolve();
  }

  onKeyDown(e: KeyboardEvent): void {
    if (e.keyCode == 66) {
      // B
      this.modeManager_.selectModeType(ModeType.BUILD);
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
    this.chessBoardWrapper_.setInitialPositionImmediately();
    this.chessBoardWrapper_.setOrientationForColor(
        this.treeModel_.getRepertoireColor());

    let emptyStudyElement = assert(document.getElementById('emptyStudy'));
    if (this.treeModel_.isEmpty()) {
      emptyStudyElement.classList.remove('hidden');
      return;
    }

    emptyStudyElement.classList.add('hidden');
    const lines = LineEmitter.emitForModel(this.treeModel_);
    const lineIterator = new LineIterator(lines);
    this.lineIteratorStudier_.study(lineIterator);
  }
}
