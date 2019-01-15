import { Chessground } from 'chessground';
import { Repertoire } from '../../../protocol/storage';
import { ChessBoardWrapper } from '../common/chessboardwrapper';
import { Mode } from '../mode/mode';
import { ModeManager } from '../mode/modemanager';
import { ModeType } from '../mode/modetype';
import { PickerController } from '../picker/pickercontroller';
import { ServerWrapper } from '../server/serverwrapper';
import { TreeModel } from '../tree/treemodel';
import { ChessBoardStudyHandler } from './chessboardstudyhandler';
import { LineEmitter } from './lineemitter';
import { LineIterator } from './lineiterator';
import { LineIteratorStudier } from './lineiteratorstudier';
import { LineStudier } from './linestudier';

import { FlagName } from '../../../flag/flags';
import { EvaluatedFlags } from '../../../protocol/evaluatedflags';
import { assert } from '../../../util/assert';
import { SoundPlayer } from '../sound/soundplayer';
import { SoundToggler } from '../sound/soundtoggler';

export class StudyMode implements Mode {
  private server_: ServerWrapper;
  private pickerController_: PickerController;
  private modeManager_: ModeManager;
  private soundToggler_: SoundToggler;
  private flags_: EvaluatedFlags;
  private treeModel_: TreeModel;
  private chessBoardWrapper_: ChessBoardWrapper;
  private lineIteratorStudier_: LineIteratorStudier;
  private studyModeElement_: HTMLElement;
  private studyButton_: HTMLElement;

  constructor(
      server: ServerWrapper,
      pickerController: PickerController,
      modeManager: ModeManager,
      soundToggler: SoundToggler,
      soundPlayer: SoundPlayer,
      flags: EvaluatedFlags) {
    this.server_ = server;
    this.pickerController_ = pickerController;
    this.modeManager_ = modeManager;
    this.soundToggler_ = soundToggler;
    this.flags_ = flags;
    this.treeModel_ = new TreeModel();

    this.chessBoardWrapper_ = new ChessBoardWrapper(soundPlayer);
    const lineStudier = new LineStudier(this.chessBoardWrapper_);
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
      if (this.flags_[FlagName.ENABLE_SOUND_TOGGLER]) {
        this.soundToggler_.toggle(); // M
      }
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
