class Repertoire {
  constructor(lines) {
    this.lines_ = lines;
  }

  getNextLine() {
    return this.lines_[Math.floor(Math.random() * this.lines_.length)];
  }
}
