import { ImpressionCode } from '../../../protocol/impression/impressioncode';
import { Repertoire } from '../../../protocol/storage';
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
import { EmptyMessage } from '../tree/emptymessage';
import { TreeModel } from '../tree/treemodel';
import { DefaultAnnotationRenderer } from './annotation/defaultannotationrenderer';
import { DefaultAnnotator } from './annotation/defaultannotator';
import { BuildBoardHandler } from './buildboardhandler';
import { ColorChooser } from './colorchooser';
import { CurrentRepertoireExporter } from './currentrepertoireexporter';
import { CurrentRepertoireUpdater } from './currentrepertoireupdater';
import { ExampleRepertoireHandler } from './examplerepertoirehandler';
import { CurrentRepertoireImporter } from './import/currentrepertoireimporter';
import { ImportDialog } from './import/importdialog';
import { RenameInput } from './renameinput';
import { TreeButtons } from './treebuttons';
import { TreeController } from './treecontroller';
import { TreeNodeHandler } from './treenodehandler';
import { TreeView } from './treeview';

export class BuildMode implements Mode {
  private impressionSender_: ImpressionSender;
  private server_: ServerWrapper;
  private pickerController_: PickerController;
  private modeManager_: ModeManager;
  private soundToggler_: SoundToggler;
  private board_: DelegatingBoard;
  private treeModel_: TreeModel;
  private renameInput_: RenameInput;
  private buildModeView_: ListRefreshableView;
  private treeController_: TreeController;
  private buildModeElement_: HTMLElement;
  private buildButton_: HTMLElement;
  private importDialog_: ImportDialog;

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

    this.board_ = new DelegatingBoard();
    this.treeModel_ = new TreeModel();
    this.buildModeView_ = new ListRefreshableView();
    const currentRepertoireUpdater = new CurrentRepertoireUpdater(
        server, pickerController, this.treeModel_);
    const currentRepertoireExporter = new CurrentRepertoireExporter(
        this.treeModel_);

    this.renameInput_ = new RenameInput(
        assert(document.getElementById('renameInput')) as HTMLInputElement,
        this.treeModel_,
        pickerController,
        currentRepertoireUpdater);
    this.buildModeView_.addView(this.renameInput_);

    const treeNodeHandler = new TreeNodeHandler(
        impressionSender, this.treeModel_, this.buildModeView_);
    const treeView = new TreeView(
        assert(document.getElementById('buildTreeViewInner')),
        assert(document.getElementById('buildTreeViewOuter')),
        this.treeModel_,
        treeNodeHandler,
        this.board_,
        new DefaultAnnotator(),
        new DefaultAnnotationRenderer());
    this.buildModeView_.addView(treeView);

    const colorChooser = new ColorChooser(
        assert(document.getElementById('colorChooserWhite')),
        assert(document.getElementById('colorChooserBlack')),
        impressionSender,
        this.treeModel_,
        this.buildModeView_,
        currentRepertoireUpdater);
    this.buildModeView_.addView(colorChooser);

    this.treeController_ = new TreeController(
        impressionSender,
        this.treeModel_,
        this.buildModeView_,
        currentRepertoireUpdater,
        currentRepertoireExporter);

    const treeButtons = new TreeButtons(
        assert(document.getElementById('treeButtons')),
        assert(document.getElementById('treeButtonLeft')),
        assert(document.getElementById('treeButtonRight')),
        assert(document.getElementById('treeButtonTrash')),
        assert(document.getElementById('treeButtonExport')),
        this.treeModel_,
        this.treeController_);
    this.buildModeView_.addView(treeButtons);

    const emptyMessage = new EmptyMessage(
        this.treeModel_, assert(document.getElementById('emptyBuild')));
    this.buildModeView_.addView(emptyMessage);

    const exampleRepertoireHandler = new ExampleRepertoireHandler(
        impressionSender,
        this.treeModel_,
        this.buildModeView_,
        pickerController,
        currentRepertoireUpdater);
    exampleRepertoireHandler.handleButtonClicks(
        assert(document.getElementById('exampleRepertoire')));

    this.importDialog_ = new ImportDialog(
        impressionSender,
        assert(document.getElementById('importPgnDialog')),
        document.getElementById('importPgnTextArea') as HTMLTextAreaElement,
        document.getElementById('importPgnUpload') as HTMLInputElement,
        assert(document.getElementById('importPgnOk')),
        assert(document.getElementById('importPgnCancel')),
        assert(document.getElementById('importPgnProgress')));
    const currentRepertoireImporter = new CurrentRepertoireImporter(
        this.importDialog_,
        this.treeModel_,
        this.buildModeView_,
        pickerController,
        currentRepertoireUpdater);

    this.importDialog_.setImporter(currentRepertoireImporter);
    const importPgnEl = assert(document.getElementById('importPgn'));
    importPgnEl.onclick = () => this.importDialog_.show();

    const handler = new BuildBoardHandler(
        this.treeModel_,
        this.treeController_,
        this.buildModeView_,
        currentRepertoireUpdater);
    chessgroundBoardFactory.createBoardAndSetDelegate(
        this.board_, 'buildBoard', handler);

    this.buildModeElement_ = assert(document.getElementById('buildMode'));
    this.buildButton_ = assert(document.getElementById('buildButton'));

    this.buildButton_.onclick
        = () => this.modeManager_.selectModeType(ModeType.BUILD);
  }

  preEnter(): Promise<void> {
    this.board_.setInitialPositionImmediately();
    return this.pickerController_
        .updatePicker()
        .then(() => this.notifySelectedMetadata());
  }

  exit(): Promise<void> {
    this.buildModeElement_.classList.add('hidden');
    this.buildButton_.classList.remove('selectedMode');
    return Promise.resolve();
  }

  postEnter(): Promise<void> {
    this.impressionSender_.sendImpression(ImpressionCode.ENTER_BUILD_MODE);
    this.buildModeElement_.classList.remove('hidden');
    this.buildButton_.classList.add('selectedMode');
    this.board_.redraw();
    return Promise.resolve();
  }

  onKeyDown(e: KeyboardEvent): void {
    if (this.renameInput_.isFocused()) {
      return;
    }
    if (this.importDialog_.isVisible()) {
      this.importDialog_.onKeyDown(e);
      return;
    }

    if (e.keyCode == 83) {
      this.modeManager_.selectModeType(ModeType.STUDY); // S
    } else if (e.keyCode == 69) {
      this.modeManager_.selectModeType(ModeType.EVALUATE); // E
    } else if (e.keyCode == 77) {
      this.soundToggler_.toggle(); // M
    } else if (e.keyCode == 70) {
      this.treeController_.flipRepertoireColor(); // F
    } else if (e.keyCode == 37) {
      this.treeController_.selectLeft(); // Left arrow
      e.preventDefault();
    } else if (e.keyCode == 38) {
      this.treeController_.selectUp(); // Up arrow
      e.preventDefault();
    } else if (e.keyCode == 39) {
      this.treeController_.selectRight(); // Right arrow
      e.preventDefault();
    } else if (e.keyCode == 40) {
      this.treeController_.selectDown(); // Down arrow
      e.preventDefault();
    } else if (e.keyCode == 8) {
      this.treeController_.trash(); // Backspace
    }
  }

  notifySelectedMetadata(): Promise<void> {
    if (this.pickerController_.isModelEmpty()) {
      return Promise.resolve();
    }
    const selectedMetadataId = this.pickerController_.getSelectedMetadataId();
    return this.server_.loadRepertoire(selectedMetadataId)
        .then(repertoire => this.onLoadRepertoire_(repertoire));
  }

  private onLoadRepertoire_(repertoire: Repertoire): void {
    this.treeModel_.loadRepertoire(repertoire);
    this.buildModeView_.refresh();
  }
}
