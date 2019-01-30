import { Color } from '../../../protocol/color';
import { assert } from '../../../util/assert';
import { AnnotationRenderer } from '../annotation/annotationrenderer';
import { Annotator } from '../annotation/annotator';
import { ChessBoardWrapper } from '../common/chessboardwrapper';
import { RefreshableView } from '../common/refreshableview';
import { Tooltips } from '../common/tooltips';
import { ViewInfo } from '../common/viewinfo';
import { TreeModel } from '../tree/treemodel';
import { TreeNodeHandler } from './treenodehandler';

enum Classes {
  DISABLED = 'disabled',
  HIDDEN = 'hidden',
  SELECTABLE = 'selectable',

  NODE = 'treeViewNode',
  SELECTED_NODE = 'selectedNode',

  ROW = 'treeViewRow',
  SEGMENT = 'treeViewSegment'
}

export class TreeView implements RefreshableView {
  private treeViewInnerElement_: HTMLElement;
  private treeViewOuterElement_: HTMLElement;
  private emptyTreeElement_: HTMLElement;
  private treeModel_: TreeModel;
  private treeNodeHandler_: TreeNodeHandler;
  private chessBoard_: ChessBoardWrapper;
  private annotator_: Annotator;
  private annotationRenderer_: AnnotationRenderer;

  constructor(
      treeViewInnerElement: HTMLElement,
      treeViewOuterElement: HTMLElement,
      emptyTreeElement: HTMLElement,
      treeModel: TreeModel,
      treeNodeHandler: TreeNodeHandler,
      chessBoard: ChessBoardWrapper,
      annotator: Annotator,
      annotationRenderer: AnnotationRenderer) {
    this.treeViewInnerElement_ = treeViewInnerElement;
    this.treeViewOuterElement_ = treeViewOuterElement;
    this.emptyTreeElement_ = emptyTreeElement;
    this.treeModel_ = treeModel;
    this.treeNodeHandler_ = treeNodeHandler;
    this.chessBoard_ = chessBoard;
    this.annotator_ = annotator;
    this.annotationRenderer_ = annotationRenderer;
  }

  refresh(): void {
    Tooltips.hideAll();

    this.treeViewInnerElement_.innerHTML = '';
    let state = new TraversalState();

    // Show/hide the empty tree element as necessary.
    let isModelEmpty = this.treeModel_.isEmpty();
    this.treeViewOuterElement_.classList.toggle(Classes.HIDDEN, isModelEmpty);
    this.emptyTreeElement_.classList.toggle(Classes.HIDDEN, !isModelEmpty);

    // Update the tree view.
    let selectedNode = null;
    this.treeModel_.traverseDepthFirst(viewInfo => {
      if (!state.rowEl) {
        // This is the first row.
        const firstRowEl = this.createRowForViewInfo_(viewInfo, state);
        state.rowEl = firstRowEl;
        state.plyToIndent[0] = 0;
      }

      state.plyToIndent.splice(viewInfo.lastMovePly + 1);

      let newRow = false;
      if (state.plyToIndent[viewInfo.lastMovePly]) {
        state.indent = state.plyToIndent[viewInfo.lastMovePly];
        state.rowEl = this.createRowForViewInfo_(viewInfo, state);
        newRow = true;
      }
      let newNode = this.appendNodeEl_(state, viewInfo, newRow);
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

    // Scroll the tree view so that the selected node is in view.
    if (selectedNode) {
      selectedNode = selectedNode as HTMLElement;
      let scrollTop = this.treeViewInnerElement_.offsetTop
          + this.treeViewInnerElement_.scrollTop;
      let scrollBottom = scrollTop + this.treeViewInnerElement_.offsetHeight;
      if (selectedNode.offsetTop < scrollTop
          || selectedNode.offsetTop > scrollBottom) {
        this.treeViewInnerElement_.scrollTop = selectedNode.offsetTop
            - this.treeViewInnerElement_.offsetTop;
      }
    }
  }

  createSegmentForViewInfo_(viewInfo: ViewInfo, state: TraversalState): void {
    const segmentEl = document.createElement('div');
    segmentEl.classList.add(Classes.SEGMENT);

    state.pgnToSegment.set(viewInfo.pgn, segmentEl);

    const segmentParent = state.rowEl
        ? state.rowEl
        : this.treeViewInnerElement_;
    segmentParent.appendChild(segmentEl);
  }

  createRowForViewInfo_(
      viewInfo: ViewInfo, state: TraversalState): HTMLElement {
    let rowEl = document.createElement('div');
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
      state: TraversalState,
      viewInfo: ViewInfo,
      newRow: boolean): HTMLElement {
    let cell = document.createElement('div');
    let label = '(start)';
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

    if (viewInfo.annotationPromise) {
      viewInfo.annotationPromise.then(annotation => {
        if (annotation) {
          this.annotationRenderer_.renderAnnotation(annotation, cell);
        }
      });
    }

    assert(state.rowEl).appendChild(cell);
    return cell;
  }
}

class TraversalState {
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
