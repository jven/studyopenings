class Main {
  constructor() {
    this.authManager_ = new AuthManager(
        document.getElementById('login'),
        document.getElementById('logout'),
        document.getElementById('hello'),
        document.getElementById('picture'));
    this.server_ = new ServerWrapper(this.authManager_);

    this.studyMode_ = new StudyMode(this.server_);
    this.buildMode_ = new BuildMode(this.server_);
    this.selectedMode_ = this.buildMode_;
  }

  run() {
    this.authManager_.detectSession()
        .then(this.onSession_.bind(this))
        .catch(err => {
          console.error('Auth error!');
          console.error(err);
          this.onSession_(false);
        });
  }

  onSession_(sessionExists) {
    document.body.onkeydown =
        this.selectedMode_.onKeyDown.bind(this.selectedMode_);
    document.getElementById('studyButton').onclick =
        this.toggleBuildMode_.bind(this, false);
    document.getElementById('buildButton').onclick =
        this.toggleBuildMode_.bind(this, true);

    // Select the build mode initially.
    this.toggleBuildMode_(true);
  }

  toggleBuildMode_(selected) {
    this.selectedMode_ = selected ? this.buildMode_ : this.studyMode_;
    this.selectedMode_.switchTo().then(() => {
      document.getElementById('studyMode').classList.toggle(
          'hidden', selected);
      document.getElementById('studyButton').classList.toggle(
          'selectedButton', !selected);

      document.getElementById('buildMode').classList.toggle(
          'hidden', !selected);
      document.getElementById('buildButton').classList.toggle(
          'selectedButton', selected);

      this.selectedMode_.resetBoardSize();
    });
  }
}

window.onload = function() {
  new Main().run();
};