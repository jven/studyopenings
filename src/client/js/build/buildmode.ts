import { assert } from '../../../util/assert';
import { Chessground } from 'chessground';
import { ChessBoardBuildHandler } from './chessboardbuildhandler';
import { ChessBoardScrollHandler } from './chessboardscrollhandler';
import { ChessBoardWrapper } from '../common/chessboardwrapper';
import { ColorChooserHandler } from './colorchooserhandler';
import { CurrentRepertoireExporter } from './currentrepertoireexporter';
import { CurrentRepertoireImporter } from './import/currentrepertoireimporter';
import { CurrentRepertoireUpdater } from './currentrepertoireupdater';
import { EvaluatedFlags } from '../../../protocol/evaluatedflags';
import { ExampleRepertoireHandler } from './examplerepertoirehandler';
import { FlagName } from '../../../flag/flags';
import { Mode } from '../mode/mode';
import { ModeManager } from '../mode/modemanager';
import { ModeType } from '../mode/modetype';
import { PickerController } from '../picker/pickercontroller';
import { RenameInput } from './renameinput';
import { Repertoire } from '../../../protocol/storage';
import { ServerWrapper } from '../server/serverwrapper';
import { TreeController } from './treecontroller';
import { TreeModel } from '../tree/treemodel';
import { TreeNodeHandler } from './treenodehandler';
import { TreeView } from './treeview';
import { ImportDialog } from './import/importdialog';

export class BuildMode implements Mode {
  private server_: ServerWrapper;
  private pickerController_: PickerController;
  private modeManager_: ModeManager;
  private chessBoardWrapper_: ChessBoardWrapper;
  private treeModel_: TreeModel;
  private renameInput_: RenameInput;
  private treeView_: TreeView;
  private treeController_: TreeController;
  private buildModeElement_: HTMLElement;
  private buildButton_: HTMLElement;
  private importDialog_: ImportDialog;

  constructor(
      server: ServerWrapper,
      pickerController: PickerController,
      modeManager: ModeManager,
      flags: EvaluatedFlags) {
    this.server_ = server;
    this.pickerController_ = pickerController;
    this.modeManager_ = modeManager;
    
    this.chessBoardWrapper_ = new ChessBoardWrapper();
    this.treeModel_ = new TreeModel();
    const currentRepertoireUpdater = new CurrentRepertoireUpdater(
        server, pickerController, this.treeModel_);
    const currentRepertoireExporter = new CurrentRepertoireExporter(
        this.treeModel_);

    this.renameInput_ = new RenameInput(
        assert(document.getElementById('renameInput')) as HTMLInputElement,
        this.treeModel_,
        pickerController,
        currentRepertoireUpdater);
    
    const treeNodeHandler = new TreeNodeHandler(this.treeModel_);
    this.treeView_ = new TreeView(
        assert(document.getElementById('treeViewInner')),
        assert(document.getElementById('treeViewOuter')),
        assert(document.getElementById('colorChooserWhite')),
        assert(document.getElementById('colorChooserBlack')),
        assert(document.getElementById('emptyTree')),
        assert(document.getElementById('treeButtons')),
        assert(document.getElementById('treeButtonLeft')),
        assert(document.getElementById('treeButtonRight')),
        assert(document.getElementById('treeButtonTrash')),
        assert(document.getElementById('treeButtonExport')),
        this.treeModel_,
        treeNodeHandler,
        this.chessBoardWrapper_);
    treeNodeHandler.setTreeView(this.treeView_);

    const colorChooserHandler = new ColorChooserHandler(
        this.treeModel_,
        this.treeView_,
        currentRepertoireUpdater);
    colorChooserHandler.handleButtonClicks(
        assert(document.getElementById('colorChooserWhite')),
        assert(document.getElementById('colorChooserBlack')));

    this.treeController_ = new TreeController(
        this.treeModel_,
        this.treeView_,
        currentRepertoireUpdater,
        currentRepertoireExporter);
    this.treeController_.handleButtonClicks(
        assert(document.getElementById('treeButtonLeft')),
        assert(document.getElementById('treeButtonRight')),
        assert(document.getElementById('treeButtonTrash')),
        assert(document.getElementById('treeButtonExport')));

    const exampleRepertoireHandler = new ExampleRepertoireHandler(
        this.treeModel_,
        this.treeView_,
        pickerController,
        currentRepertoireUpdater,
        this.renameInput_);
    exampleRepertoireHandler.handleButtonClicks(
        assert(document.getElementById('exampleRepertoire')));

    const currentRepertoireImporter = new CurrentRepertoireImporter(
        this.treeModel_, this.treeView_, currentRepertoireUpdater);
    this.importDialog_ = new ImportDialog(
        currentRepertoireImporter,
        assert(document.getElementById('importPgnDialog')),
        document.getElementById('importPgnTextArea') as HTMLTextAreaElement,
        document.getElementById('importPgnUpload') as HTMLInputElement,
        assert(document.getElementById('importPgnOk')),
        assert(document.getElementById('importPgnCancel')));
    if (flags[FlagName.ENABLE_PGN_IMPORT]) {
      const importPgnEl = assert(document.getElementById('importPgn'));
      importPgnEl.classList.remove('hidden');
      importPgnEl.onclick = () => this.importDialog_.show();
    }

    const handler = new ChessBoardBuildHandler(
        this.treeModel_, this.treeView_, currentRepertoireUpdater);
    const buildBoardElement = assert(document.getElementById('buildBoard'));
    const chessBoard = Chessground(buildBoardElement, {
      movable: {
        free: false
      },
      events: {
        move: handler.onMove.bind(handler),
        change: handler.onChange.bind(handler)
      }
    });
    $(window).resize(
        this.chessBoardWrapper_.redraw.bind(this.chessBoardWrapper_));
    this.chessBoardWrapper_.setChessBoard(chessBoard, buildBoardElement);

    const scrollHandler = new ChessBoardScrollHandler(this.treeController_);
    scrollHandler.handleScrollEventsOn(buildBoardElement);

    this.buildModeElement_ = assert(document.getElementById('buildMode'));
    this.buildButton_ = assert(document.getElementById('buildButton'));

    this.buildButton_.onclick
        = () => this.modeManager_.selectModeType(ModeType.BUILD);
  }

  preEnter(): Promise<void> {
    this.chessBoardWrapper_.setInitialPositionImmediately();
    return this.pickerController_
        .updatePicker()
        .then(() => this.notifySelectedMetadata());
  }

  exit(): Promise<void> {
    this.buildModeElement_.classList.add('hidden');
    this.buildButton_.classList.remove('selectedButton');
    return Promise.resolve();
  }

  postEnter(): Promise<void> {
    this.buildModeElement_.classList.remove('hidden');
    this.buildButton_.classList.add('selectedButton');
    this.chessBoardWrapper_.redraw();
    return Promise.resolve();
  }

  onKeyDown(e: KeyboardEvent): void {
    if (this.renameInput_.isFocused()
        || this.importDialog_.isVisible()) {
      return;
    }

    if (e.keyCode == 83) {
      this.modeManager_.selectModeType(ModeType.STUDY); // S
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
    this.treeView_.refresh();
    this.renameInput_.refresh();
  }
}