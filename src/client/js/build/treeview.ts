import { Color } from '../../../protocol/color';
import { ChessBoardWrapper } from '../common/chessboardwrapper';
import { Tooltips } from '../common/tooltips';
import { ViewInfo } from '../common/viewinfo';
import { TreeModel } from '../tree/treemodel';
import { TreeNodeHandler } from './treenodehandler';

import { assert } from '../../../util/assert';
import { Annotator } from '../annotate/annotator';
import { DisplayType } from '../annotate/displaytype';

declare var tippy: any;

enum Classes {
  DISABLED = 'disabled',
  HIDDEN = 'hidden',
  SELECTABLE = 'selectable',
  SELECTED_COLOR = 'selectedColor',

  NODE = 'treeViewNode',
  SELECTED_NODE = 'selectedNode',
  TRANSPOSITION_NODE = 'transpositionNode',
  WARNING_NODE = 'warningNode',
  
  ROW = 'treeViewRow',
  SEGMENT = 'treeViewSegment'
}

export class TreeView {
  private treeViewInnerElement_: HTMLElement;
  private treeViewOuterElement_: HTMLElement;
  private colorChooserWhiteElement_: HTMLElement;
  private colorChooserBlackElement_: HTMLElement;
  private emptyTreeElement_: HTMLElement;
  private treeButtonsElement_: HTMLElement;
  private treeButtonLeftElement_: HTMLElement;
  private treeButtonRightElement_: HTMLElement;
  private treeButtonTrashElement_: HTMLElement;
  private treeButtonExportElement_: HTMLElement;
  private treeModel_: TreeModel;
  private treeNodeHandler_: TreeNodeHandler;
  private chessBoard_: ChessBoardWrapper;
  private annotator_: Annotator;

  constructor(
      treeViewInnerElement: HTMLElement,
      treeViewOuterElement: HTMLElement,
      colorChooserWhiteElement: HTMLElement,
      colorChooserBlackElement: HTMLElement,
      emptyTreeElement: HTMLElement,
      treeButtonsElement: HTMLElement,
      treeButtonLeftElement: HTMLElement,
      treeButtonRightElement: HTMLElement,
      treeButtonTrashElement: HTMLElement,
      treeButtonExportElement: HTMLElement,
      treeModel: TreeModel,
      treeNodeHandler: TreeNodeHandler,
      chessBoard: ChessBoardWrapper,
      annotator: Annotator) {
    this.treeViewInnerElement_ = treeViewInnerElement;
    this.treeViewOuterElement_ = treeViewOuterElement;
    this.colorChooserWhiteElement_ = colorChooserWhiteElement;
    this.colorChooserBlackElement_ = colorChooserBlackElement;
    this.emptyTreeElement_ = emptyTreeElement;
    this.treeButtonsElement_ = treeButtonsElement;
    this.treeButtonLeftElement_ = treeButtonLeftElement;
    this.treeButtonRightElement_ = treeButtonRightElement;
    this.treeButtonTrashElement_ = treeButtonTrashElement;
    this.treeButtonExportElement_ = treeButtonExportElement;
    this.treeModel_ = treeModel;
    this.treeNodeHandler_ = treeNodeHandler;
    this.chessBoard_ = chessBoard;
    this.annotator_ = annotator;
  }

  refresh() {
    Tooltips.hideAll();

    this.treeViewInnerElement_.innerHTML = '';
    var state = new State_();

    // Show/hide the empty tree element as necessary.
    var isModelEmpty = this.treeModel_.isEmpty();
    this.treeViewOuterElement_.classList.toggle(Classes.HIDDEN, isModelEmpty);
    this.emptyTreeElement_.classList.toggle(Classes.HIDDEN, !isModelEmpty);
    this.treeButtonsElement_.classList.toggle(Classes.HIDDEN, isModelEmpty);

    // Disable the tree buttons as necessary.
    var hasPrevious = this.treeModel_.hasPreviousPgn();
    this.treeButtonLeftElement_.classList.toggle(
        Classes.DISABLED, !hasPrevious);
    this.treeButtonLeftElement_.classList.toggle(
        Classes.SELECTABLE, hasPrevious);

    var hasNext = this.treeModel_.hasNextPgn();
    this.treeButtonRightElement_.classList.toggle(Classes.DISABLED, !hasNext);
    this.treeButtonRightElement_.classList.toggle(Classes.SELECTABLE, hasNext);

    var canTrash = this.treeModel_.canRemoveSelectedPgn();
    this.treeButtonTrashElement_.classList.toggle(Classes.DISABLED, !canTrash);
    this.treeButtonTrashElement_.classList.toggle(Classes.SELECTABLE, canTrash);

    this.treeButtonExportElement_.classList.add(Classes.SELECTABLE);

    // Update the tree view.
    var selectedNode = null;
    this.treeModel_.traverseDepthFirst(viewInfo => {
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
    }, this.annotator_);

    // Update the chess board.
    const color = this.treeModel_.getRepertoireColor();
    this.chessBoard_.setStateFromChess(
        this.treeModel_.getChessForState());
    this.chessBoard_.setOrientationForColor(color);

    // Update the color chooser buttons.
    this.colorChooserWhiteElement_.classList.toggle(
        Classes.SELECTED_COLOR, color == Color.WHITE);
    this.colorChooserBlackElement_.classList.toggle(
        Classes.SELECTED_COLOR, color == Color.BLACK);

    // Scroll the tree view so that the selected node is in view.
    if (selectedNode) {
      selectedNode = selectedNode as HTMLElement;
      var scrollTop = this.treeViewInnerElement_.offsetTop
          + this.treeViewInnerElement_.scrollTop;
      var scrollBottom = scrollTop + this.treeViewInnerElement_.offsetHeight;
      if (selectedNode.offsetTop < scrollTop
          || selectedNode.offsetTop > scrollBottom) {
        this.treeViewInnerElement_.scrollTop = selectedNode.offsetTop
            - this.treeViewInnerElement_.offsetTop;
      }
    }
  }

  createSegmentForViewInfo_(viewInfo: ViewInfo, state: State_): void {
    const segmentEl = document.createElement('div');
    segmentEl.classList.add(Classes.SEGMENT);

    state.pgnToSegment.set(viewInfo.pgn, segmentEl);

    const segmentParent = state.rowEl ? state.rowEl : this.treeViewInnerElement_;
    segmentParent.appendChild(segmentEl);
  }

  createRowForViewInfo_(viewInfo: ViewInfo, state: State_): HTMLElement {
    var rowEl = document.createElement('div');
    rowEl.classList.add(Classes.ROW);
    
    let rowParent = this.treeViewInnerElement_;
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
    
    const annotation = viewInfo.annotation;
    if (annotation && annotation.displayType == DisplayType.WARNING) {
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
          const newElement = document.createElement('li');
          newElement.innerHTML = annotation.content;
          contentList.appendChild(newElement);
          return content;
        },
        delay: 0,
        duration: 0,
        placement: 'bottom',
        theme: 'warningTooltip'
      });
    } else if (
        annotation && annotation.displayType == DisplayType.INFORMATIONAL) {
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
              .innerHTML = assert(annotation).title;
          assert(content.querySelector('.transpositionTooltipContent-body'))
              .innerHTML = assert(annotation).content;
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
