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
    this.selectedMode_ = null;
  }

  run() {
    Toasts.initialize();
    this.authManager_.detectSession()
        .then(this.onSession_.bind(this))
        .catch(err => {
          console.error('Auth error!');
          console.error(err);
          this.onSession_(false);
        });
  }

  onSession_(sessionExists) {
    Tooltips.addTo([
      document.getElementById('studyButton'),
      document.getElementById('buildButton'),
      document.getElementById('colorChooser'),
      document.getElementById('treeButtonLeft'),
      document.getElementById('treeButtonRight'),
      document.getElementById('treeButtonTrash')
    ]);

    document.body.onkeydown = this.onKeyDown_.bind(this);
    document.getElementById('studyButton').onclick =
        this.toggleBuildMode_.bind(this, false);
    document.getElementById('buildButton').onclick =
        this.toggleBuildMode_.bind(this, true);

    // Select the build mode initially.
    this.toggleBuildMode_(true);
  }

  toggleBuildMode_(selected) {
    const newMode = selected ? this.buildMode_ : this.studyMode_;
    if (this.selectedMode_ == newMode) {
      // This mode is already selected.
      return;
    }

    newMode.preSwitchTo().then(() => {
      document.getElementById('studyMode').classList.toggle(
          'hidden', selected);
      document.getElementById('studyButton').classList.toggle(
          'selectedButton', !selected);

      document.getElementById('buildMode').classList.toggle(
          'hidden', !selected);
      document.getElementById('buildButton').classList.toggle(
          'selectedButton', selected);

      newMode.postSwitchTo();
    });

    this.selectedMode_ = newMode;
  }

  onKeyDown_(e) {
    if (window.doorbellShown) {
      // Disable key events when the feedback form is visible.
      return;
    }

    if (e.keyCode == 83) {
      // S
      this.toggleBuildMode_(false);
      return;
    }

    if (e.keyCode == 66) {
      // B
      this.toggleBuildMode_(true);
      return;
    }
    
    this.selectedMode_.onKeyDown(e);
  }
}

window.onload = function() {
  new Main().run();
};