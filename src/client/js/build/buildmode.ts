import { Chessground } from 'chessground';
import { ChessBoardBuildHandler } from './chessboardbuildhandler';
import { ChessBoardWrapper } from '../common/chessboardwrapper';
import { ColorChooserHandler } from './colorchooserhandler';
import { ExampleRepertoireHandler } from './examplerepertoirehandler';
import { Mode } from '../mode/mode';
import { ModeManager } from '../mode/modemanager';
import { ModeType } from '../mode/modetype';
import { PickerController } from '../picker/pickercontroller';
import { RepertoireJson } from '../../../protocol/protocol';
import { RepertoireModel } from '../common/repertoiremodel';
import { ServerWrapper } from '../common/serverwrapper';
import { TreeButtonHandler } from './treebuttonhandler';
import { TreeNodeHandler } from './treenodehandler';
import { TreeView } from './treeview';

import { assert } from '../../../util/assert';

export class BuildMode implements Mode {
  private server_: ServerWrapper;
  private pickerController_: PickerController;
  private modeManager_: ModeManager;
  private chessBoardWrapper_: ChessBoardWrapper;
  private repertoireModel_: RepertoireModel;
  private treeView_: TreeView;
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
    this.repertoireModel_ = new RepertoireModel(server);
    
    const treeNodeHandler = new TreeNodeHandler(this.repertoireModel_);
    this.treeView_ = new TreeView(
        assert(document.getElementById('treeView')),
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
        this.repertoireModel_, this.treeView_);
    colorChooserHandler.handleButtonClicks(
        assert(document.getElementById('colorChooserWhite')),
        assert(document.getElementById('colorChooserBlack')));

    const treeButtonHandler = new TreeButtonHandler(
        this.repertoireModel_, this.treeView_);
    treeButtonHandler.handleButtonClicks(
        assert(document.getElementById('treeButtonLeft')),
        assert(document.getElementById('treeButtonRight')),
        assert(document.getElementById('treeButtonTrash')));

    const exampleRepertoireHandler = new ExampleRepertoireHandler(
        this.repertoireModel_, this.server_, this.treeView_);
    exampleRepertoireHandler.handleButtonClicks(
        assert(document.getElementById('exampleRepertoire')));

    const handler = new ChessBoardBuildHandler(
        this.repertoireModel_, this.treeView_);
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

    this.buildButton_.onclick = this.modeManager_.selectModeType.bind(
        this.modeManager_, ModeType.BUILD);
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
    if (e.keyCode == 70) {
      // F
      this.repertoireModel_.flipRepertoireColor();
      this.treeView_.refresh();
    } else if (e.keyCode == 37) {
      // Left arrow
      if (this.repertoireModel_.hasPreviousPgn()) {
        this.repertoireModel_.selectPreviousPgn();
        this.treeView_.refresh();
      }
    } else if (e.keyCode == 38) {
      // Up arrow
      if (this.repertoireModel_.hasPreviousSiblingPgn()) {
        this.repertoireModel_.selectPreviousSiblingPgn();
        this.treeView_.refresh();
      }
    } else if (e.keyCode == 39) {
      // Right arrow
      if (this.repertoireModel_.hasNextPgn()) {
        this.repertoireModel_.selectNextPgn();
        this.treeView_.refresh();
      }
    } else if (e.keyCode == 40) {
      // Down arrow
      if (this.repertoireModel_.hasNextSiblingPgn()) {
        this.repertoireModel_.selectNextSiblingPgn();
        this.treeView_.refresh();
      }
    } else if (e.keyCode == 8) {
      // Backspace
      if (this.repertoireModel_.canRemoveSelectedPgn()) {
        this.repertoireModel_.removeSelectedPgn();
        this.treeView_.refresh();
      }
    }
  }

  notifySelectedMetadata(): Promise<void> {
    const selectedMetadataId = this.pickerController_.getSelectedMetadataId();
    return this.server_.loadRepertoire(selectedMetadataId)
        .then(repertoireJson => this.onLoadRepertoire_(repertoireJson));
  }

  private onLoadRepertoire_(repertoireJson: RepertoireJson): void {
    this.repertoireModel_.updateFromServer(repertoireJson);
    this.treeView_.refresh();
  }
}