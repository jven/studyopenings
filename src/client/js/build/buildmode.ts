import { Chessground } from 'chessground';
import { ChessBoardBuildHandler } from './chessboardbuildhandler';
import { ChessBoardWrapper } from '../common/chessboardwrapper';
import { ColorChooserHandler } from './colorchooserhandler';
import { ExampleRepertoireHandler } from './examplerepertoirehandler';
import { Mode } from '../mode/mode';
import { ModeManager } from '../mode/modemanager';
import { ModeType } from '../mode/modetype';
import { PickerController } from '../picker/pickercontroller';
import { RenameInput } from './renameinput';
import { Repertoire } from '../../../protocol/storage';
import { RepertoireModel } from '../tree/repertoiremodel';
import { ServerWrapper } from '../server/serverwrapper';
import { TreeController } from './treecontroller';
import { TreeNodeHandler } from './treenodehandler';
import { TreeView } from './treeview';

import { assert } from '../../../util/assert';
import { CurrentRepertoireUpdater } from '../common/currentrepertoireupdater';

export class BuildMode implements Mode {
  private server_: ServerWrapper;
  private pickerController_: PickerController;
  private modeManager_: ModeManager;
  private chessBoardWrapper_: ChessBoardWrapper;
  private repertoireModel_: RepertoireModel;
  private renameInput_: RenameInput;
  private treeView_: TreeView;
  private treeController_: TreeController;
  private buildModeElement_: HTMLElement;
  private buildButton_: HTMLElement;

  constructor(
      server: ServerWrapper,
      pickerController: PickerController,
      modeManager: ModeManager) {
    this.server_ = server;
    this.pickerController_ = pickerController;
    this.modeManager_ = modeManager;
    
    this.chessBoardWrapper_ = new ChessBoardWrapper();
    this.repertoireModel_ = new RepertoireModel();
    const currentRepertoireUpdater = new CurrentRepertoireUpdater(
        server, pickerController, this.repertoireModel_);

    this.renameInput_ = new RenameInput(
        assert(document.getElementById('renameInput')) as HTMLInputElement,
        this.repertoireModel_,
        pickerController,
        currentRepertoireUpdater);
    
    const treeNodeHandler = new TreeNodeHandler(this.repertoireModel_);
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
        this.repertoireModel_,
        treeNodeHandler,
        this.chessBoardWrapper_);
    treeNodeHandler.setTreeView(this.treeView_);

    const colorChooserHandler = new ColorChooserHandler(
        this.repertoireModel_,
        this.treeView_,
        currentRepertoireUpdater);
    colorChooserHandler.handleButtonClicks(
        assert(document.getElementById('colorChooserWhite')),
        assert(document.getElementById('colorChooserBlack')));

    this.treeController_ = new TreeController(
        this.repertoireModel_,
        this.treeView_,
        currentRepertoireUpdater);
    this.treeController_.handleButtonClicks(
        assert(document.getElementById('treeButtonLeft')),
        assert(document.getElementById('treeButtonRight')),
        assert(document.getElementById('treeButtonTrash')));

    const exampleRepertoireHandler = new ExampleRepertoireHandler(
        this.repertoireModel_,
        this.treeView_,
        pickerController,
        currentRepertoireUpdater,
        this.renameInput_);
    exampleRepertoireHandler.handleButtonClicks(
        assert(document.getElementById('exampleRepertoire')));

    const handler = new ChessBoardBuildHandler(
        this.repertoireModel_, this.treeView_, currentRepertoireUpdater);
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
    if (this.renameInput_.isFocused()) {
      return;
    }

    if (e.keyCode == 83) {
      this.modeManager_.selectModeType(ModeType.STUDY); // S
    } else if (e.keyCode == 70) {
      this.treeController_.flipRepertoireColor(); // F
    } else if (e.keyCode == 37) {
      this.treeController_.selectLeft(); // Left arrow
    } else if (e.keyCode == 38) {
      this.treeController_.selectUp(); // Up arrow
    } else if (e.keyCode == 39) {
      this.treeController_.selectRight(); // Right arrow
    } else if (e.keyCode == 40) {
      this.treeController_.selectDown(); // Down arrow
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
        .then(repertoireJson => this.onLoadRepertoire_(repertoireJson));
  }

  private onLoadRepertoire_(repertoireJson: Repertoire): void {
    this.repertoireModel_.updateFromServer(repertoireJson);
    this.treeView_.refresh();
    this.renameInput_.refresh();
  }
}