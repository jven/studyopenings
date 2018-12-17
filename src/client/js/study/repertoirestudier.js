class RepertoireStudier {
  constructor(lineStudier) {
    this.lineStudier_ = lineStudier;
    this.repertoire_ = null;
    this.current
  }

  study(repertoire) {
    this.repertoire_ = repertoire;
    this.studyNextLine_();
  }

  studyNextLine_() {
    var line = this.repertoire_.getNextLine();
    if (!line) {
      return;
    }
    this.lineStudier_.study(line).then(success => {
      if (success) {
        setTimeout(
            this.studyNextLine_.bind(this),
            Config.NEXT_LINE_DELAY_MS);
      }
    });
  }
}