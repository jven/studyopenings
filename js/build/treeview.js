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
      if (!viewInfo.lastMoveString) {
        this.appendNodeEl_(state, '(start)', viewInfo.position, viewInfo.pgn);
      }
      if (viewInfo.numChildren <= 1) {
        var label = viewInfo.lastMoveColor == Color.WHITE
            ? viewInfo.lastMoveNumber + '. ' + viewInfo.lastMoveString
            : viewInfo.lastMoveString;
        this.appendNodeEl_(state, label, viewInfo.position, viewInfo.pgn);
      }
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

  appendNodeEl_(state, label, position, pgn) {
    var cell = document.createElement('div');
    cell.innerText = label;
    cell.classList.add('treeViewNode');
    cell.onclick = this.treeNodeHandler_.onClick.bind(
        this.treeNodeHandler_, pgn);
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