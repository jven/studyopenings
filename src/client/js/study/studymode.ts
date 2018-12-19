import { ChessBoardStudyHandler } from './chessboardstudyhandler';
import { ChessBoardWrapper } from '../common/chessboardwrapper';
import { Chessground } from 'chessground';
import { LineStudier } from './linestudier';
import { Mode } from '../mode/mode';
import { ModeManager } from '../mode/modemanager';
import { ModeType } from '../mode/modetype';
import { Repertoire } from './repertoire';
import { RepertoireJson } from '../../../protocol/protocol';
import { RepertoireModel } from '../common/repertoiremodel';
import { RepertoireStudier } from './repertoirestudier';
import { ServerWrapper } from '../common/serverwrapper';

import { assert } from '../../../util/assert';

export class StudyMode implements Mode {
  private server_: ServerWrapper;
  private modeManager_: ModeManager;
  private repertoireModel_: RepertoireModel;
  private chessBoardWrapper_: ChessBoardWrapper;
  private repertoireStudier_: RepertoireStudier;
  private studyModeElement_: HTMLElement;
  private studyButton_: HTMLElement;

  constructor(server: ServerWrapper, modeManager: ModeManager) {
    this.server_ = server;
    this.modeManager_ = modeManager;
    this.repertoireModel_ = new RepertoireModel(server);

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
    return this.server_
        .getAllRepertoireMetadata()
        .then(metadata => {
          if (metadata.length && metadata[0].id) {
            return this.server_.loadRepertoire(metadata[0].id);
          }
          throw new Error('No metadata found!');
        })
        .then(this.onLoadRepertoire_.bind(this));
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

  onKeyDown(): void {}

  private onLoadRepertoire_(repertoireJson: RepertoireJson): void {
    this.repertoireModel_.updateFromServer(repertoireJson);
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