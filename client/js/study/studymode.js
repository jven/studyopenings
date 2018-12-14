class StudyMode {
  constructor(server) {
    this.server_ = server;
    this.repertoireModel_ = new RepertoireModel(server);

    this.chessBoardWrapper_ = new ChessBoardWrapper();
    const lineStudier = new LineStudier(this.chessBoardWrapper_);
    this.repertoireStudier_ = new RepertoireStudier(lineStudier);
    const handler = new ChessBoardStudyHandler(lineStudier);
    
    const studyBoardElement = document.getElementById('studyBoard');
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

  preSwitchTo() {
    this.chessBoardWrapper_.setInitialPositionImmediately();
    return this.server_
        .getAllRepertoireMetadata()
        .then(metadata => {
          if (metadata.length && metadata[0].id) {
            return this.server_.loadRepertoire(metadata[0].id);
          }
        })
        .then(this.onLoadRepertoire_.bind(this));
  }

  postSwitchTo() {
    this.chessBoardWrapper_.redraw();
  }

  onKeyDown() {}

  onLoadRepertoire_(repertoireJson) {
    this.repertoireModel_.updateFromServer(repertoireJson);
    var emptyStudyElement = document.getElementById('emptyStudy');
    if (this.repertoireModel_.isEmpty()) {
      emptyStudyElement.classList.toggle('hidden', false);
      return;
    }
    emptyStudyElement.classList.toggle('hidden', true);
    var repertoire = Repertoire.fromModel(this.repertoireModel_);
    this.repertoireStudier_.study(repertoire);
  }
}