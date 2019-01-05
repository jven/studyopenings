import { ChessBoardWrapper } from '../common/chessboardwrapper';
import { Color } from '../../../protocol/color';
import { Config } from '../common/config';
import { RepertoireModel } from '../tree/repertoiremodel';
import { TreeNodeHandler } from './treenodehandler';
import { Tooltips } from '../common/tooltips';
import { ViewInfo } from '../common/viewinfo';

import { assert } from '../../../util/assert';

declare var tippy: any;

enum Classes {
  DISABLED = 'disabled',
  HIDDEN = 'hidden',
  SELECTABLE = 'selected',
  SELECTED_COLOR = 'selectedColor',

  NODE = 'treeViewNode',
  SELECTED_NODE = 'selectedNode',
  TRANSPOSITION_NODE = 'transpositionNode',
  WARNING_NODE = 'warningNode',
  
  ROW = 'treeViewRow',
  SEGMENT = 'treeViewSegment'
}

export class TreeView {
  private treeViewElement_: HTMLElement;
  private colorChooserWhiteElement_: HTMLElement;
  private colorChooserBlackElement_: HTMLElement;
  private emptyTreeElement_: HTMLElement;
  private treeButtonsElement_: HTMLElement;
  private treeButtonLeftElement_: HTMLElement;
  private treeButtonRightElement_: HTMLElement;
  private treeButtonTrashElement_: HTMLElement;
  private repertoireModel_: RepertoireModel;
  private treeNodeHandler_: TreeNodeHandler;
  private chessBoard_: ChessBoardWrapper;

  constructor(
      treeViewElement: HTMLElement,
      colorChooserWhiteElement: HTMLElement,
      colorChooserBlackElement: HTMLElement,
      emptyTreeElement: HTMLElement,
      treeButtonsElement: HTMLElement,
      treeButtonLeftElement: HTMLElement,
      treeButtonRightElement: HTMLElement,
      treeButtonTrashElement: HTMLElement,
      repertoireModel: RepertoireModel,
      treeNodeHandler: TreeNodeHandler,
      chessBoard: ChessBoardWrapper) {
    this.treeViewElement_ = treeViewElement;
    this.colorChooserWhiteElement_ = colorChooserWhiteElement;
    this.colorChooserBlackElement_ = colorChooserBlackElement;
    this.emptyTreeElement_ = emptyTreeElement;
    this.treeButtonsElement_ = treeButtonsElement;
    this.treeButtonLeftElement_ = treeButtonLeftElement;
    this.treeButtonRightElement_ = treeButtonRightElement;
    this.treeButtonTrashElement_ = treeButtonTrashElement;
    this.repertoireModel_ = repertoireModel;
    this.treeNodeHandler_ = treeNodeHandler;
    this.chessBoard_ = chessBoard;
  }

  refresh() {
    Tooltips.hideAll();

    this.treeViewElement_.innerHTML = '';
    var state = new State_();

    // Show/hide the empty tree element as necessary.
    var isModelEmpty = this.repertoireModel_.isEmpty();
    this.treeViewElement_.classList.toggle(Classes.HIDDEN, isModelEmpty);
    this.emptyTreeElement_.classList.toggle(Classes.HIDDEN, !isModelEmpty);
    this.treeButtonsElement_.classList.toggle(Classes.HIDDEN, isModelEmpty);

    // Disable the tree buttons as necessary.
    var hasPrevious = this.repertoireModel_.hasPreviousPgn();
    this.treeButtonLeftElement_.classList.toggle(
        Classes.DISABLED, !hasPrevious);
    this.treeButtonLeftElement_.classList.toggle(
        Classes.SELECTABLE, hasPrevious);

    var hasNext = this.repertoireModel_.hasNextPgn();
    this.treeButtonRightElement_.classList.toggle(Classes.DISABLED, !hasNext);
    this.treeButtonRightElement_.classList.toggle(Classes.SELECTABLE, hasNext);

    var canTrash = this.repertoireModel_.canRemoveSelectedPgn();
    this.treeButtonTrashElement_.classList.toggle(Classes.DISABLED, !canTrash);
    this.treeButtonTrashElement_.classList.toggle(Classes.SELECTABLE, canTrash);

    // Update the tree view.
    var selectedNode = null;
    this.repertoireModel_.traverseDepthFirstPreorder(viewInfo => {
      if (!state.rowEl) {
        // This is the first row.
        const firstRowEl = this.createRowForViewInfo_(viewInfo, state);
        state.rowEl = firstRowEl;
        state.plyToIndent[0] = 0;
      }

      state.plyToIndent.splice(viewInfo.lastMovePly + 1);

      var newRow = false;
      if (state.plyToIndent[viewInfo.lastMovePly]) {
        state.indent = state.plyToIndent[viewInfo.lastMovePly];
        state.rowEl = this.createRowForViewInfo_(viewInfo, state);
        newRow = true;
      }
      var newNode = this.appendNodeEl_(state, viewInfo, newRow);
      if (viewInfo.isSelected) {
        selectedNode = newNode;
      }
      if (viewInfo.numChildren > 1) {
        this.createSegmentForViewInfo_(viewInfo, state);
        state.plyToIndent[viewInfo.lastMovePly + 1] = state.indent + 1;
      }
    });

    // Update the chess board.
    const color = this.repertoireModel_.getRepertoireColor();
    this.chessBoard_.setStateFromChess(
        this.repertoireModel_.getChessForState());
    this.chessBoard_.setOrientationForColor(color);

    // Update the color chooser buttons.
    this.colorChooserWhiteElement_.classList.toggle(
        Classes.SELECTED_COLOR, color == Color.WHITE);
    this.colorChooserBlackElement_.classList.toggle(
        Classes.SELECTED_COLOR, color == Color.BLACK);

    // Scroll the tree view so that the selected node is in view.
    if (selectedNode) {
      selectedNode = selectedNode as HTMLElement;
      var scrollTop = this.treeViewElement_.offsetTop
          + this.treeViewElement_.scrollTop;
      var scrollBottom = scrollTop + this.treeViewElement_.offsetHeight;
      if (selectedNode.offsetTop < scrollTop
          || selectedNode.offsetTop > scrollBottom) {
        this.treeViewElement_.scrollTop = selectedNode.offsetTop
            - this.treeViewElement_.offsetTop;
      }
    }
  }

  createSegmentForViewInfo_(viewInfo: ViewInfo, state: State_): void {
    const segmentEl = document.createElement('div');
    segmentEl.classList.add(Classes.SEGMENT);

    state.pgnToSegment.set(viewInfo.pgn, segmentEl);

    const segmentParent = state.rowEl ? state.rowEl : this.treeViewElement_;
    segmentParent.appendChild(segmentEl);
  }

  createRowForViewInfo_(viewInfo: ViewInfo, state: State_): HTMLElement {
    var rowEl = document.createElement('div');
    rowEl.classList.add(Classes.ROW);
    
    let rowParent = this.treeViewElement_;
    // This needs to check for null explicitly since parentPgn can be the empty
    // string.
    if (viewInfo.parentPgn != null) {
      const parentSegment = state.pgnToSegment.get(viewInfo.parentPgn);
      if (parentSegment) {
        rowParent = parentSegment;
      }
    }
    rowParent.appendChild(rowEl);
    return rowEl;
  }

  appendNodeEl_(
      state: State_,
      viewInfo: ViewInfo,
      newRow: boolean): HTMLElement {
    var cell = document.createElement('div');
    var label = '(start)'
    if (viewInfo.lastMoveString) {
      label = viewInfo.lastMoveColor == Color.WHITE
          ? viewInfo.lastMoveVerboseString
          : (newRow
              ? viewInfo.lastMoveVerboseString
              : viewInfo.lastMoveString);
    }
    cell.innerText = label;
    cell.classList.add(Classes.NODE);
    cell.onclick = this.treeNodeHandler_.onClick.bind(
        this.treeNodeHandler_, viewInfo.pgn);
    cell.classList.toggle(Classes.SELECTED_NODE, viewInfo.isSelected);
    
    if (viewInfo.warnings.length) {
      // Indicate warnings.
      cell.classList.add(Classes.WARNING_NODE);
      const template = assert(
          document.getElementById('warningTooltipContentTemplate'));
      tippy(cell, {
        a11y: false,
        animateFill: false,
        animation: 'fade',
        content() {
          const content = document.createElement('div');
          content.innerHTML = template.innerHTML;
          const contentList =
              assert(content.querySelector('.warningTooltipContent-list'));
          viewInfo.warnings.forEach(w => {
            const newElement = document.createElement('li');
            newElement.innerHTML = w;
            contentList.appendChild(newElement);
          });
          return content;
        },
        delay: 0,
        duration: 0,
        placement: 'bottom',
        theme: 'warningTooltip'
      });
    } else if (viewInfo.transposition) {
      // Indicate transposition.
      cell.classList.add(Classes.TRANSPOSITION_NODE);
      const template = assert(document.getElementById(
          'transpositionTooltipContentTemplate'));
      tippy(cell, {
        a11y: false,
        animateFill: false,
        animation: 'fade',
        content() {
          const content = document.createElement('div');
          content.innerHTML = template.innerHTML;
          assert(content.querySelector('.transpositionTooltipContent-title'))
              .innerHTML = assert(viewInfo.transposition).title;
          assert(content.querySelector('.transpositionTooltipContent-body'))
              .innerHTML = assert(viewInfo.transposition).message;
          return content;
        },
        delay: 0,
        duration: 0,
        placement: 'bottom',
        theme: 'transpositionTooltip'
      });
    }

    assert(state.rowEl).appendChild(cell);
    return cell;
  }
}

class State_ {
  public indent: number;
  public plyToIndent: number[];
  public pgnToSegment: Map<string, HTMLElement>;
  public rowEl: HTMLElement | null;

  constructor() {
    this.indent = 0;
    this.plyToIndent = [];
    this.pgnToSegment = new Map();
    this.rowEl = null;
  }
}