import { Chessground } from 'chessground';
import { ChessBoardBuildHandler } from './chessboardbuildhandler';
import { ChessBoardWrapper } from '../common/chessboardwrapper';
import { ColorChooserHandler } from './colorchooserhandler';
import { ExampleRepertoireHandler } from './examplerepertoirehandler';
import { RepertoireJson } from '../../../protocol/protocol';
import { RepertoireModel } from '../common/repertoiremodel';
import { ServerWrapper } from '../common/serverwrapper';
import { TreeButtonHandler } from './treebuttonhandler';
import { TreeNodeHandler } from './treenodehandler';
import { TreeView } from './treeview';

import { assert } from '../../../util/assert';

export class BuildMode {
  private server_: ServerWrapper;
  private chessBoardWrapper_: ChessBoardWrapper;
  private repertoireModel_: RepertoireModel;
  private treeView_: TreeView;

  constructor(server: ServerWrapper) {
    this.server_ = server;
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
  }

  preSwitchTo(): Promise<void> {
    this.chessBoardWrapper_.setInitialPositionImmediately();
    return this.server_
        .getAllRepertoireMetadata()
        .then(metadata => {
          if (metadata.length && metadata[0].id) {
            return this.server_.loadRepertoire(metadata[0].id);
          }
          throw new Error('No metadata found!');
        })
        .then(this.onLoadRepertoire_.bind(this));
  }

  postSwitchTo(): void {
    this.chessBoardWrapper_.redraw();
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

  onLoadRepertoire_(repertoireJson: RepertoireJson): void {
    this.repertoireModel_.updateFromServer(repertoireJson);
    this.treeView_.refresh();
  }
}