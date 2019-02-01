import { ImpressionCode } from '../../../protocol/impression/impressioncode';
import { assert } from '../../../util/assert';
import { ChessgroundBoardFactory } from '../board/chessgroundboardfactory';
import { DelegatingBoard } from '../board/delegatingboard';
import { ListRefreshableView } from '../common/listrefreshableview';
import { ImpressionSender } from '../impressions/impressionsender';
import { Mode } from '../mode/mode';
import { ModeManager } from '../mode/modemanager';
import { ModeType } from '../mode/modetype';
import { PickerController } from '../picker/pickercontroller';
import { ServerWrapper } from '../server/serverwrapper';
import { SoundToggler } from '../sound/soundtoggler';
import { DelegatingStatisticsModel } from '../statistics/delegatingstatisticsmodel';
import { ServerStatisticsModel } from '../statistics/serverstatisticsmodel';
import { TreeButtons } from '../tree/treebuttons';
import { TreeModel } from '../tree/treemodel';
import { TreeNavigator } from '../tree/treenavigator';
import { TreeNodeHandler } from '../tree/treenodehandler';
import { TreeView } from '../tree/treeview';
import { StatisticAnnotationRenderer } from './annotation/statisticannotationrenderer';
import { StatisticAnnotator } from './annotation/statisticannotator';
import { ChildMoveDrawer } from './childmovedrawer';
import { EvaluateBoardHandler } from './evaluateboardhandler';
import { InsightCalculator } from './insights/insightcalculator';
import { InsightsPanel } from './insights/insightspanel';
import { RepertoireNameLabel } from './repertoirenamelabel';

export class EvaluateMode implements Mode {
  private impressionSender_: ImpressionSender;
  private server_: ServerWrapper;
  private pickerController_: PickerController;
  private modeManager_: ModeManager;
  private soundToggler_: SoundToggler;
  private chessgroundBoardFactory_: ChessgroundBoardFactory;

  private evaluateModeElement_: HTMLElement;
  private evaluateButton_: HTMLElement;

  private modeView_: ListRefreshableView;
  private treeModel_: TreeModel;
  private board_: DelegatingBoard;
  private treeNavigator_: TreeNavigator;
  private statisticsModel_: DelegatingStatisticsModel;

  constructor(
      impressionSender: ImpressionSender,
      server: ServerWrapper,
      pickerController: PickerController,
      modeManager: ModeManager,
      soundToggler: SoundToggler,
      chessgroundBoardFactory: ChessgroundBoardFactory) {
    this.impressionSender_ = impressionSender;
    this.server_ = server;
    this.pickerController_ = pickerController;
    this.modeManager_ = modeManager;
    this.soundToggler_ = soundToggler;
    this.chessgroundBoardFactory_ = chessgroundBoardFactory;

    this.evaluateModeElement_ = assert(document.getElementById('evaluateMode'));
    this.evaluateButton_ = assert(document.getElementById('evaluateButton'));
    this.evaluateButton_.onclick = () => this.modeManager_.selectModeType(
        ModeType.EVALUATE);

    this.modeView_ = new ListRefreshableView();
    this.treeModel_ = new TreeModel();
    this.board_ = new DelegatingBoard();
    this.treeNavigator_ = new TreeNavigator(
        impressionSender, this.treeModel_, this.modeView_);
    this.statisticsModel_ = new DelegatingStatisticsModel();

    this.createChessgroundBoard_();
    this.createChildMoveDrawer_();
    this.createTreeView_();
    this.createTreeButtons_();
    this.createRepertoireNameLabel_();
    this.createInsightsPanel_();
  }

  private createChessgroundBoard_(): void {
    this.chessgroundBoardFactory_.createBoardAndSetDelegate(
        this.board_,
        'evaluateBoard',
        new EvaluateBoardHandler(this.treeNavigator_),
        true /* viewOnly */);
  }

  private createChildMoveDrawer_(): void {
    const childMoveDrawer = new ChildMoveDrawer(this.treeModel_, this.board_);
    this.modeView_.addView(childMoveDrawer);
  }

  private createTreeView_(): void {
    const treeView = new TreeView(
        assert(document.getElementById('evaluateTreeViewInner')),
        assert(document.getElementById('evaluateTreeViewOuter')),
        this.treeModel_,
        new TreeNodeHandler(
            this.impressionSender_, this.treeModel_, this.modeView_),
        this.board_,
        new StatisticAnnotator(this.statisticsModel_),
        new StatisticAnnotationRenderer());
    this.modeView_.addView(treeView);
  }

  private createTreeButtons_(): void {
    const treeButtons = new TreeButtons(
        assert(document.getElementById('evaluateTreeButtons')),
        this.treeModel_);
    treeButtons
        .addNavigationButtons(
            assert(document.getElementById('evaluateTreeLeft')),
            assert(document.getElementById('evaluateTreeRight')),
            this.treeNavigator_);
    this.modeView_.addView(treeButtons);
  }

  private createRepertoireNameLabel_(): void {
    const repertoireNameLabel = new RepertoireNameLabel(
        assert(document.getElementById('repertoireNameLabel')),
        this.treeModel_);
    this.modeView_.addView(repertoireNameLabel);
  }

  private createInsightsPanel_(): void {
    const calculator = new InsightCalculator(
        this.treeModel_, this.statisticsModel_);
    const panel = new InsightsPanel(
        assert(document.getElementById('insightsPanel')),
        calculator);
    this.modeView_.addView(panel);
  }

  preEnter(): Promise<void> {
    this.board_.setInitialPositionImmediately();
    return this.pickerController_.updatePicker()
        .then(() => this.notifySelectedMetadata());
  }

  exit(): Promise<void> {
    this.toggleEvaluteUi_(false);
    return Promise.resolve();
  }

  postEnter(): Promise<void> {
    this.impressionSender_.sendImpression(ImpressionCode.ENTER_EVALUATE_MODE);
    this.toggleEvaluteUi_(true);
    this.board_.redraw();
    return Promise.resolve();
  }

  onKeyDown(e: KeyboardEvent): void {
    if (e.keyCode == 83) {
      this.modeManager_.selectModeType(ModeType.STUDY); // S
    } else if (e.keyCode == 66) {
      this.modeManager_.selectModeType(ModeType.BUILD); // B
    } else if (e.keyCode == 77) {
      this.soundToggler_.toggle(); // M
    } else if (e.keyCode == 37) {
      this.treeNavigator_.selectLeft(); // Left arrow
      e.preventDefault();
    } else if (e.keyCode == 38) {
      this.treeNavigator_.selectUp(); // Up arrow
      e.preventDefault();
    } else if (e.keyCode == 39) {
      this.treeNavigator_.selectRight(); // Right arrow
      e.preventDefault();
    } else if (e.keyCode == 40) {
      this.treeNavigator_.selectDown(); // Down arrow
      e.preventDefault();
    }
  }

  notifySelectedMetadata(): Promise<void> {
    if (this.pickerController_.isModelEmpty()) {
      return Promise.resolve();
    }
    const selectedMetadataId = this.pickerController_.getSelectedMetadataId();
    return this.server_.loadRepertoire(selectedMetadataId)
        .then(repertoire => {
          this.treeModel_.loadRepertoire(repertoire);
          this.statisticsModel_.setDelegate(
              new ServerStatisticsModel(this.server_, selectedMetadataId));
          this.modeView_.refresh();
          // For some reason the arrows drawn on the Evaluate board don't show
          // unless this refresh is done on a timeout, so do it twice.
          setTimeout(() => this.modeView_.refresh(), 0);
        });
  }

  private toggleEvaluteUi_(enable: boolean): void {
    this.evaluateModeElement_.classList.toggle('hidden', !enable);
    this.evaluateButton_.classList.toggle('selectedMode', enable);
  }
}
