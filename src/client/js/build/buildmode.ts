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
import { ServerWrapper } from '../server/serverwrapper';
import { TreeController } from './treecontroller';
import { TreeModel } from '../tree/treemodel';
import { TreeNodeHandler } from './treenodehandler';
import { TreeView } from './treeview';

import { assert } from '../../../util/assert';
import { CurrentRepertoireUpdater } from './currentrepertoireupdater';
import { ChessBoardScrollHandler } from './chessboardscrollhandler';
import { CurrentRepertoireExporter } from './currentrepertoireexporter';
import { EvaluatedFlags } from '../../../protocol/evaluatedflags';
import { FlagName } from '../../../flag/flags';
import { CurrentRepertoireImporter } from './currentrepertoireimporter';

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

    if (flags[FlagName.ENABLE_PGN_IMPORT]) {
      const importPgnEl = assert(document.getElementById('importPgn'));
      importPgnEl.classList.remove('hidden');

      const importer = new CurrentRepertoireImporter(
          this.treeModel_, this.treeView_, currentRepertoireUpdater);
      const pgn = `[Event "King's Gambit for Black"]\n[Site "http://studyopenings.com"]\n[UTCDate "2019.01.09"]\n[UTCTime "00:52:30"]\n[Result "*"]\n\n1. e4 e5 2. f4 exf4 3. Nf3 (3. Bc4 g5 4. Nf3) 3... g5 4. Bc4 (4. h4 g4 5. Ne5 (5. Ng5 h6 6. Nxf7 Kxf7 7. Qxg4 Nf6 8. Qxf4 Bd6 9. Bc4+ Kg7) 5... Nf6 6. Bc4 (6. Nxg4 Nxe4 7. d3 Ng3 8. Bxf4 Qe7+ 9. Be2 (9. Kd2 Qb4+ 10. Nc3 Qxf4+) 9... Rg8 10. Bxg3 Rxg4 11. Bf2 Rxg2) 6... d5 7. exd5 Bd6 8. d4 O-O) 4... Bg7 5. O-O (5. d4 d6 6. O-O) 5... d6 6. d4 h6 7. Nc3 (7. c3 Nc6 8. Qb3 Qd7) 7... Nc6 8. Bb5 Ne7 9. Nd5 O-O *`;
      importPgnEl.onclick = () => importer.importPgn(pgn);
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
    if (this.renameInput_.isFocused()) {
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