class TreeView {
  constructor(treeViewElement, repertoireModel, treeNodeHandler, chessBoard) {
    this.treeViewElement_ = treeViewElement;
    this.repertoireModel_ = repertoireModel;
    this.treeNodeHandler_ = treeNodeHandler;
    this.chessBoard_ = chessBoard;
  }

  refresh() {
    this.treeViewElement_.innerHTML = '';
    var state = new State_();
    var firstRowEl = this.createRowEl_(0);
    state.rowEl = firstRowEl;
    state.plyToIndent[0] = 0;

    // Update the tree view.
    this.repertoireModel_.traverseDepthFirst(viewInfo => {
      state.plyToIndent.splice(viewInfo.lastMovePly + 1);

      var newRow = false;
      if (state.plyToIndent[viewInfo.lastMovePly]) {
        state.indent = state.plyToIndent[viewInfo.lastMovePly];
        state.rowEl = this.createRowEl_(state.indent);
        newRow = true;
      }
      this.appendNodeEl_(state, viewInfo, newRow);
      if (viewInfo.numChildren > 1) {
        state.plyToIndent[viewInfo.lastMovePly + 1] = state.indent + 1;
      }
    });

    // Update the chess board.
    var selectedViewInfo = this.repertoireModel_.getSelectedViewInfo();
    this.chessBoard_.setPositionImmediately(selectedViewInfo.position);
  }

  createRowEl_(indent) {
    var rowEl = document.createElement('div');
    rowEl.classList.add('treeViewRow');
    rowEl.classList.toggle('evenRow', indent % 2 == 0);
    rowEl.classList.toggle('oddRow', indent % 2 == 1);
    rowEl.style.paddingLeft = Config.TREE_ROW_PADDING_PX_PER_INDENT * indent +
        'px';
    this.treeViewElement_.appendChild(rowEl);
    return rowEl;
  }

  appendNodeEl_(state, viewInfo, newRow) {
    var cell = document.createElement('div');
    var label = '(start)'
    if (viewInfo.lastMoveString) {
      label = viewInfo.lastMoveColor == Color.WHITE
          ? viewInfo.lastMoveNumber + '. ' + viewInfo.lastMoveString
          : (newRow
              ? viewInfo.lastMoveNumber + '... ' + viewInfo.lastMoveString
              : viewInfo.lastMoveString);
    }
    cell.innerText = label;
    cell.classList.add('treeViewNode');
    cell.onclick = this.treeNodeHandler_.onClick.bind(
        this.treeNodeHandler_, viewInfo.pgn);
    cell.classList.toggle('selectedNode', viewInfo.isSelected);
    state.rowEl.appendChild(cell);
    return cell;
  }
}

class State_ {
  constructor() {
    this.indent = 0;
    this.plyToIndent = [];
    this.rowEl = null;
  }
}