import { ChessBoardStudyHandler } from './chessboardstudyhandler';
import { ChessBoardWrapper } from '../common/chessboardwrapper';
import { Chessground } from 'chessground';
import { LineStudier } from './linestudier';
import { Repertoire } from './repertoire';
import { RepertoireJson } from '../../../protocol/protocol';
import { RepertoireModel } from '../common/repertoiremodel';
import { RepertoireStudier } from './repertoirestudier';
import { ServerWrapper } from '../common/serverwrapper';

import { assert } from '../../../util/assert';

export class StudyMode {
  private server_: ServerWrapper;
  private repertoireModel_: RepertoireModel;
  private chessBoardWrapper_: ChessBoardWrapper;
  private repertoireStudier_: RepertoireStudier;

  constructor(server: ServerWrapper) {
    this.server_ = server;
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
  }

  preSwitchTo(): Promise<void> {
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

  postSwitchTo(): void {
    this.chessBoardWrapper_.redraw();
  }

  onKeyDown(): void {}

  onLoadRepertoire_(repertoireJson: RepertoireJson): void {
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