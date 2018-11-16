class TreeView {
  constructor(treeViewElement, treeModel, treeNodeHandler, chessBoard) {
    this.treeViewElement_ = treeViewElement;
    this.treeModel_ = treeModel;
    this.treeNodeHandler_ = treeNodeHandler;
    this.chessBoard_ = chessBoard;
  }

  refresh() {
    this.treeViewElement_.innerHTML = '';
    var state = new State_();
    var firstRowEl = this.createRowEl_(0);
    state.rowEl = firstRowEl;

    // Update the tree view.
    this.treeModel_.traverseDepthFirst(viewInfo => {
      this.appendNodeEl_(state, viewInfo);
    });

    // Update the chess board.
    var selectedViewInfo = this.treeModel_.getSelectedViewInfo();
    this.chessBoard_.setPositionImmediately(selectedViewInfo.position);
  }

  createRowEl_(indent) {
    var firstRowEl = document.createElement('div');
    firstRowEl.classList.add('treeViewRow');
    firstRowEl.style.paddingLeft = 5 * indent + 'px';
    this.treeViewElement_.appendChild(firstRowEl);
    return firstRowEl;
  }

  appendNodeEl_(state, viewInfo) {
    var cell = document.createElement('div');
    var label = '(start)'
    if (viewInfo.lastMoveString) {
      label = viewInfo.lastMoveColor == Color.WHITE
          ? viewInfo.lastMoveNumber + '. ' + viewInfo.lastMoveString
          : viewInfo.numChildren <= 1
              ? viewInfo.lastMoveString
              : viewInfo.lastMoveNumber + '... ' + viewInfo.lastMoveString;
    }
    cell.innerText = label;
    cell.classList.add('treeViewNode');
    cell.onclick = this.treeNodeHandler_.onClick.bind(
        this.treeNodeHandler_, viewInfo.pgn);
    cell.classList.toggle('selected', viewInfo.isSelected);
    state.rowEl.appendChild(cell);
    return cell;
  }
}

class State_ {
  constructor() {
    this.indent = 0;
    this.plyToIndent = {};
    this.rowEl = null;
  }
}