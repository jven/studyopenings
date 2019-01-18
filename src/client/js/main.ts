import { FlagName } from '../../flag/flags';
import { EvaluatedFlags } from '../../protocol/evaluatedflags';
import { ImpressionCode } from '../../protocol/impression/impressioncode';
import { assert } from '../../util/assert';
import { getRandomString } from '../../util/random';
import { AuthManager } from './auth/authmanager';
import { BuildMode } from './build/buildmode';
import { Toasts } from './common/toasts';
import { Tooltips } from './common/tooltips';
import { FooterLinks } from './footer/footerlinks';
import { DebouncingImpressionSender } from './impressions/debouncingimpressionsender';
import { ImpressionSender } from './impressions/impressionsender';
import { ModeManager } from './mode/modemanager';
import { ModeType } from './mode/modetype';
import { NoOpMode } from './mode/noopmode';
import { PickerController } from './picker/pickercontroller';
import { PickerFeature } from './picker/pickerfeature';
import { AccessTokenServerWrapper } from './server/accesstokenserverwrapper';
import { DelegatingServerWrapper } from './server/delegatingserverwrapper';
import { EvaluatedFlagFetcher } from './server/evaluatedflagfetcher';
import { LocalStorageServerWrapper } from './server/localstorageserverwrapper';
import { SoundPlayer } from './sound/soundplayer';
import { SoundToggler } from './sound/soundtoggler';
import { StudyMode } from './study/studymode';

declare var window: any;

class Main {
  static run() {
    EvaluatedFlagFetcher.fetchEvaluatedFlags().then(
        flags => this.withFlags_(flags));
  }

  private static withFlags_(flags: EvaluatedFlags) {
    const authManager = new AuthManager(
        assert(document.getElementById('login')),
        assert(document.getElementById('logout')),
        assert(document.getElementById('hello')),
        document.getElementById('picture') as HTMLImageElement);
    const impressionSender = new DebouncingImpressionSender(
        getRandomString(15) /* impressionSessionId */,
        authManager,
        10000 /* debounceIntervalMs */);
    const server = new DelegatingServerWrapper(
        new LocalStorageServerWrapper(window.localStorage));
    const modeManager = new ModeManager();
    const pickerController = new PickerController(
        impressionSender, server, modeManager);

    const soundToggler = new SoundToggler(
        assert(document.getElementById('soundToggler')),
        assert(document.getElementById('soundOn')),
        assert(document.getElementById('soundOff')));
    const soundPlayer = new SoundPlayer(soundToggler);

    const themeToggler = assert(document.getElementById('themeToggler'));
    if (flags[FlagName.ENABLE_THEME_TOGGLER]) {
      themeToggler.classList.remove('hidden');
    }

    Toasts.initialize();
    Tooltips.addTo([
      assert(document.getElementById('studyButton')),
      assert(document.getElementById('buildButton')),
      assert(document.getElementById('colorChooser')),
      assert(document.getElementById('treeButtonLeft')),
      assert(document.getElementById('treeButtonRight')),
      assert(document.getElementById('treeButtonTrash')),
      assert(document.getElementById('treeButtonExport')),
      assert(document.getElementById('soundToggler'))
    ]);
    PickerFeature.install(pickerController);

    FooterLinks.logImpressionsForClicks(
        impressionSender,
        assert(document.getElementById('aboutPageLink')),
        assert(document.getElementById('sourceCodeLink')));

    const studyMode = new StudyMode(
        impressionSender,
        server,
        pickerController,
        modeManager,
        soundToggler,
        soundPlayer);
    const buildMode = new BuildMode(
        impressionSender,
        server,
        pickerController,
        modeManager,
        soundToggler,
        soundPlayer);
    modeManager
        .registerMode(ModeType.INITIAL, new NoOpMode())
        .registerMode(ModeType.STUDY, studyMode)
        .registerMode(ModeType.BUILD, buildMode)
        // Select a no-op mode immediately to avoid any edge cases on
        // initialization with no selected mode.
        .selectModeType(ModeType.INITIAL);

    authManager.detectSession()
        .then(() => Main.onSession_(
            impressionSender, authManager, server, modeManager))
        .catch(err => {
          Main.onSession_(
              impressionSender, authManager, server, modeManager);
          throw err;
        });
  }

  private static onSession_(
      impressionSender: ImpressionSender,
      authManager: AuthManager,
      delegatingServerWrapper: DelegatingServerWrapper,
      modeManager: ModeManager): void {
    impressionSender.sendImpression(ImpressionCode.INITIAL_LOAD_COMPLETE);

    const accessToken = authManager.getAccessToken();
    if (accessToken) {
      delegatingServerWrapper.setDelegate(
          new AccessTokenServerWrapper(accessToken));
    }

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
