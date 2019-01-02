import { ChessBoardStudyHandler } from './chessboardstudyhandler';
import { ChessBoardWrapper } from '../common/chessboardwrapper';
import { Chessground } from 'chessground';
import { LineStudier } from './linestudier';
import { Mode } from '../mode/mode';
import { ModeManager } from '../mode/modemanager';
import { ModeType } from '../mode/modetype';
import { PickerController } from '../picker/pickercontroller';
import { Repertoire } from './repertoire';
import { Repertoire as RepertoireProtocol } from '../../../protocol/protocol';
import { RepertoireModel } from '../common/repertoiremodel';
import { RepertoireStudier } from './repertoirestudier';
import { ServerWrapper } from '../common/serverwrapper';

import { assert } from '../../../util/assert';

export class StudyMode implements Mode {
  private server_: ServerWrapper;
  private pickerController_: PickerController;
  private modeManager_: ModeManager;
  private repertoireModel_: RepertoireModel;
  private chessBoardWrapper_: ChessBoardWrapper;
  private repertoireStudier_: RepertoireStudier;
  private studyModeElement_: HTMLElement;
  private studyButton_: HTMLElement;

  constructor(
      server: ServerWrapper,
      pickerController: PickerController,
      modeManager: ModeManager) {
    this.server_ = server;
    this.pickerController_ = pickerController;
    this.modeManager_ = modeManager;
    this.repertoireModel_ = new RepertoireModel(server, pickerController);

    this.chessBoardWrapper_ = new ChessBoardWrapper();
    const lineStudier = new LineStudier(this.chessBoardWrapper_);
    this.repertoireStudier_ = new RepertoireStudier(lineStudier);
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

  private onLoadRepertoire_(repertoireProtocol: RepertoireProtocol): void {
    this.repertoireModel_.updateFromServer(repertoireProtocol);
    var emptyStudyElement = assert(document.getElementById('emptyStudy'));
    if (this.repertoireModel_.isEmpty()) {
      emptyStudyElement.classList.remove('hidden');
      return;
    }
    emptyStudyElement.classList.add('hidden');
    var repertoire = Repertoire.fromModel(this.repertoireModel_);
    this.repertoireStudier_.study(repertoire);
  }
}