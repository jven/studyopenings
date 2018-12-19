import { AuthManager } from './authmanager';
import { BuildMode } from './build/buildmode';
import { ModeManager } from './mode/modemanager';
import { ModeType } from './mode/modetype';
import { PickerController } from './picker/pickercontroller';
import { PickerFeature } from './picker/pickerfeature';
import { ServerWrapper } from './common/serverwrapper';
import { StudyMode } from './study/studymode';
import { Toasts } from './common/toasts';
import { Tooltips } from './common/tooltips';

class Main {
  constructor() {
    this.authManager_ = new AuthManager(
        document.getElementById('login'),
        document.getElementById('logout'),
        document.getElementById('hello'),
        document.getElementById('picture'));
    this.server_ = new ServerWrapper(this.authManager_);
    this.modeManager_ = new ModeManager();
    this.pickerController_ = new PickerController(this.server_);
  }

  run() {
    Toasts.initialize();
    Tooltips.addTo([
      document.getElementById('studyButton'),
      document.getElementById('buildButton'),
      document.getElementById('colorChooser'),
      document.getElementById('treeButtonLeft'),
      document.getElementById('treeButtonRight'),
      document.getElementById('treeButtonTrash')
    ]);
    PickerFeature.install(this.pickerController_);

    const studyMode = new StudyMode(this.server_, this.modeManager_);
    const buildMode = new BuildMode(this.server_, this.modeManager_);
    this.modeManager_
        .registerMode(ModeType.STUDY, studyMode)
        .registerMode(ModeType.BUILD, buildMode);

    this.authManager_.detectSession()
        .then(this.onSession_.bind(this))
        .catch(err => {
          this.onSession_();
          throw err;
        });
  }

  onSession_() {
    document.body.onkeydown = this.onKeyDown_.bind(this);

    // Select the build mode initially.
    this.modeManager_.selectModeType(ModeType.BUILD);
  }

  onKeyDown_(e) {
    if (window.doorbellShown) {
      // Disable key events when the feedback form is visible.
      return;
    }

    if (e.keyCode == 83) {
      // S
      this.modeManager_.selectModeType(ModeType.STUDY);
    } else if (e.keyCode == 66) {
      // B
      this.modeManager_.selectModeType(ModeType.BUILD);
    } else {
      this.modeManager_.getSelectedMode().onKeyDown(e);
    }
  }
}

window.onload = function() {
  new Main().run();
};