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

import { assert } from '../../util/assert';

declare var window: any;

class Main {
  static run() {
    const authManager = new AuthManager(
        assert(document.getElementById('login')),
        assert(document.getElementById('logout')),
        assert(document.getElementById('hello')),
        document.getElementById('picture') as HTMLImageElement);
    const server = new ServerWrapper(authManager);
    const modeManager = new ModeManager();
    const pickerController = new PickerController(server);

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

    const studyMode = new StudyMode(server, modeManager);
    const buildMode = new BuildMode(server, modeManager);
    modeManager
        .registerMode(ModeType.STUDY, studyMode)
        .registerMode(ModeType.BUILD, buildMode);

    authManager.detectSession()
        .then(() => Main.onSession_(modeManager))
        .catch(err => {
          Main.onSession_(modeManager);
          throw err;
        });
  }

  private static onSession_(modeManager: ModeManager): void {
    document.body.onkeydown = (e) => Main.onKeyDown_(modeManager, e);

    // Select the build mode initially.
    modeManager.selectModeType(ModeType.BUILD);
  }

  private static onKeyDown_(
      modeManager: ModeManager, e: KeyboardEvent): void {
    if (window.doorbellShown) {
      // Disable key events when the feedback form is visible.
      return;
    }

    if (e.keyCode == 83) {
      // S
      modeManager.selectModeType(ModeType.STUDY);
    } else if (e.keyCode == 66) {
      // B
      modeManager.selectModeType(ModeType.BUILD);
    } else {
      modeManager.getSelectedMode().onKeyDown(e);
    }
  }
}

window.onload = function() {
  Main.run();
};