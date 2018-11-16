class RepertoireStudier {
  constructor(lineStudier) {
    this.lineStudier_ = lineStudier;
    this.repertoire_ = null;
  }

  study(repertoire) {
    this.repertoire_ = repertoire;
    this.studyNextLine_();
  }

  studyNextLine_() {
    var line = this.repertoire_.getNextLine();
    this.lineStudier_.study(line).then(() => {
      setTimeout(
          this.studyNextLine_.bind(this),
          Config.NEXT_LINE_DELAY_MS);
    });
  }
}