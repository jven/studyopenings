import { FlagName } from '../../flag/flags';
import { EvaluatedFlags } from '../../protocol/evaluatedflags';
import { ImpressionCode } from '../../protocol/impression/impressioncode';
import { assert } from '../../util/assert';
import { getRandomString } from '../../util/random';
import { AuthManager } from './auth/authmanager';
import { ChessgroundBoardFactory } from './board/chessgroundboardfactory';
import { BuildMode } from './build/buildmode';
import { Toasts } from './common/toasts';
import { Tooltips } from './common/tooltips';
import { EvaluateMode } from './evaluate/evaluatemode';
import { FooterLinks } from './footer/footerlinks';
import { DebouncingImpressionSender } from './impressions/debouncingimpressionsender';
import { ImpressionSender } from './impressions/impressionsender';
import { ModeManager } from './mode/modemanager';
import { ModeType } from './mode/modetype';
import { NoOpMode } from './mode/noopmode';
import { ConfirmDeleteDialog } from './picker/confirmdeletedialog';
import { PickerController } from './picker/pickercontroller';
import { PickerFeature } from './picker/pickerfeature';
import { PreferenceLoader } from './preferences/preferenceloader';
import { PreferenceSaver } from './preferences/preferencesaver';
import { PrivelegedCopyDialog } from './priveleged/privelegedcopydialog';
import { PrivelegedFeature } from './priveleged/privelegedfeature';
import { AccessTokenServerWrapper } from './server/accesstokenserverwrapper';
import { DelegatingServerWrapper } from './server/delegatingserverwrapper';
import { EvaluatedFlagFetcher } from './server/evaluatedflagfetcher';
import { LocalStorageServerWrapper } from './server/localstorageserverwrapper';
import { SoundPlayer } from './sound/soundplayer';
import { SoundToggler } from './sound/soundtoggler';
import { StudyMode } from './study/studymode';
import { allThemes } from './theme/boardthemeinfo';
import { BoardThemeSetter } from './theme/boardthemesetter';
import { ThemePalette } from './theme/themepalette';

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
    const preferenceSaver = new PreferenceSaver(server);

    const soundToggler = new SoundToggler(
        impressionSender,
        preferenceSaver,
        assert(document.getElementById('soundToggler')),
        assert(document.getElementById('soundOn')),
        assert(document.getElementById('soundOff')));
    const soundPlayer = new SoundPlayer(soundToggler);
    const chessgroundBoardFactory = new ChessgroundBoardFactory(soundPlayer);

    const boardThemeInfoMap = allThemes();
    const boardThemeSetter = new BoardThemeSetter(
        chessgroundBoardFactory, boardThemeInfoMap);
    new ThemePalette(impressionSender, boardThemeSetter, preferenceSaver)
        .initializePalette(
            assert(document.getElementById('themePalette')),
            assert(document.getElementById('themePaletteTooltipContent')),
            boardThemeInfoMap);

    Toasts.initialize();
    Tooltips.initialize();

    const confirmDeleteDialog = new ConfirmDeleteDialog(
        pickerController,
        assert(document.getElementById('pickerConfirmDeleteDialog')),
        assert(document.getElementById('pickerConfirmDeleteName')),
        assert(document.getElementById('pickerConfirmDeleteOk')),
        assert(document.getElementById('pickerConfirmDeleteCancel')));
    PickerFeature.install(flags, pickerController, confirmDeleteDialog);

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
        chessgroundBoardFactory);
    const buildMode = new BuildMode(
        impressionSender,
        server,
        pickerController,
        modeManager,
        soundToggler,
        chessgroundBoardFactory);
    modeManager
        .registerMode(ModeType.INITIAL, new NoOpMode())
        .registerMode(ModeType.STUDY, studyMode)
        .registerMode(ModeType.BUILD, buildMode)
        // Select a no-op mode immediately to avoid any edge cases on
        // initialization with no selected mode.
        .selectModeType(ModeType.INITIAL);

    const evaluateButton = assert(document.getElementById('evaluateButton'));
    if (flags[FlagName.ENABLE_EVALUATE_MODE]) {
      evaluateButton.classList.remove('hidden');
      const evaluateMode = new EvaluateMode(
          impressionSender,
          server,
          pickerController,
          modeManager,
          soundToggler,
          chessgroundBoardFactory);
      modeManager.registerMode(ModeType.EVALUATE, evaluateMode);
    } else {
      evaluateButton.remove();
    }

    const preferenceLoader = new PreferenceLoader(
        server, boardThemeSetter, soundToggler);
    const privelegedCopyDialog = new PrivelegedCopyDialog(
        server,
        pickerController,
        assert(document.getElementById('privelegedCopyDialog')),
        assert(document.getElementById(
            'privelegedCopyInput')) as HTMLInputElement);

    if (window.location.href.includes('priveleged=true')) {
      PrivelegedFeature.install(privelegedCopyDialog);
    }

    authManager.detectSession()
        .then(() => Main.onSession_(
            preferenceLoader,
            impressionSender,
            authManager,
            server,
            modeManager,
            privelegedCopyDialog,
            confirmDeleteDialog));
  }

  private static onSession_(
      preferenceLoader: PreferenceLoader,
      impressionSender: ImpressionSender,
      authManager: AuthManager,
      delegatingServerWrapper: DelegatingServerWrapper,
      modeManager: ModeManager,
      privelegedCopyDialog: PrivelegedCopyDialog,
      confirmDeleteDialog: ConfirmDeleteDialog): void {
    impressionSender.sendImpression(ImpressionCode.INITIAL_LOAD_COMPLETE);

    const accessToken = authManager.getAccessToken();
    if (accessToken) {
      delegatingServerWrapper.setDelegate(
          new AccessTokenServerWrapper(accessToken));
    }

    preferenceLoader.load();

    // Select the build mode initially.
    modeManager.selectModeType(ModeType.BUILD).then(
        () => {
          document.body.onkeydown = (e) => Main.onKeyDown_(
              modeManager,
              privelegedCopyDialog,
              confirmDeleteDialog,
              e);
        });
  }

  private static onKeyDown_(
      modeManager: ModeManager,
      privelegedCopyDialog: PrivelegedCopyDialog,
      confirmDeleteDialog: ConfirmDeleteDialog,
      e: KeyboardEvent): void {
    if (window.doorbellShown) {
      // Disable key events when the feedback form is visible.
      return;
    }
    if (privelegedCopyDialog.isVisible()) {
      privelegedCopyDialog.onKeyDown(e);
      return;
    }
    if (confirmDeleteDialog.isVisible()) {
      confirmDeleteDialog.onKeyDown(e);
      return;
    }

    modeManager.getSelectedMode().onKeyDown(e);
  }
}

window.onload = function() {
  Main.run();
};
