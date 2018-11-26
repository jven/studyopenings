class StudyMode {
  constructor(server) {
    this.server_ = server;
    this.repertoireModel_ = new RepertoireModel(server);

    this.chessBoardWrapper_ = new ChessBoardWrapper();
    const lineStudier = new LineStudier(this.chessBoardWrapper_);
    this.repertoireStudier_ = new RepertoireStudier(lineStudier);
    const handler = new ChessBoardStudyHandler(lineStudier);
    
    const chessBoard = Chessground(document.getElementById('studyBoard'), {
      movable: {
        free: false
      },
      events: {
        move: handler.onMove.bind(handler)
      }
    });
    $(window).resize(
        this.chessBoardWrapper_.resize.bind(this.chessBoardWrapper_));
    this.chessBoardWrapper_.setChessBoard(chessBoard);
  }

  switchTo() {
    this.chessBoardWrapper_.setInitialPositionImmediately();
    return this.server_
        .loadRepertoire()
        .then(this.onLoadRepertoire_.bind(this));
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