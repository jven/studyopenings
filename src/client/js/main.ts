import { AuthManager } from './auth/authmanager';
import { BuildMode } from './build/buildmode';
import { ModeManager } from './mode/modemanager';
import { ModeType } from './mode/modetype';
import { PickerController } from './picker/pickercontroller';
import { PickerFeature } from './picker/pickerfeature';
import { ServerWrapper } from './server/serverwrapper';
import { StudyMode } from './study/studymode';
import { Toasts } from './common/toasts';
import { Tooltips } from './common/tooltips';

import { assert } from '../../util/assert';
import { NoOpMode } from './mode/noopmode';
import { AuthServerWrapper } from './server/authserverwrapper';

declare var window: any;

class Main {
  static run() {
    const authManager = new AuthManager(
        assert(document.getElementById('login')),
        assert(document.getElementById('logout')),
        assert(document.getElementById('hello')),
        document.getElementById('picture') as HTMLImageElement);
    const server = new AuthServerWrapper(authManager);
    const modeManager = new ModeManager();
    const pickerController = new PickerController(server, modeManager);

    Toasts.initialize();
    Tooltips.addTo([
      assert(document.getElementById('studyButton')),
      assert(document.getElementById('buildButton')),
      assert(document.getElementById('colorChooser')),
      assert(document.getElementById('treeButtonLeft')),
      assert(document.getElementById('treeButtonRight')),
      assert(document.getElementById('treeButtonTrash'))
    ]);
    PickerFeature.install(pickerController);

    const studyMode = new StudyMode(server, pickerController, modeManager);
    const buildMode = new BuildMode(server, pickerController, modeManager);
    modeManager
        .registerMode(ModeType.INITIAL, new NoOpMode())
        .registerMode(ModeType.STUDY, studyMode)
        .registerMode(ModeType.BUILD, buildMode)
        // Select a no-op mode immediately to avoid any edge cases on
        // initialization with no selected mode.
        .selectModeType(ModeType.INITIAL);

    authManager.detectSession()
        .then(() => Main.onSession_(modeManager))
        .catch(err => {
          Main.onSession_(modeManager);
          throw err;
        });
  }

  private static onSession_(modeManager: ModeManager): void {
    // Select the build mode initially.
    modeManager.selectModeType(ModeType.BUILD).then(
        () => {
          document.body.onkeydown = (e) => Main.onKeyDown_(modeManager, e);
        });
  }

  private static onKeyDown_(
      modeManager: ModeManager, e: KeyboardEvent): void {
    if (window.doorbellShown) {
      // Disable key events when the feedback form is visible.
      return;
    }

    modeManager.getSelectedMode().onKeyDown(e);
  }
}

window.onload = function() {
  Main.run();
};