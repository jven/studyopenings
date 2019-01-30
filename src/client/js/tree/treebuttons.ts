import { RefreshableView } from '../common/refreshableview';
import { TreeButton } from './treebutton';
import { TreeModel } from './treemodel';
import { TreeNavigator } from './treenavigator';

export class TreeButtons implements RefreshableView {
  private buttonsEl_: HTMLElement;
  private treeModel_: TreeModel;
  private buttons_: TreeButton[];

  constructor(
      buttonsEl: HTMLElement,
      treeModel: TreeModel) {
    this.buttonsEl_ = buttonsEl;
    this.treeModel_ = treeModel;
    this.buttons_ = [];
  }

  refresh(): void {
    // Show/hide the button container as necessary.
    let isModelEmpty = this.treeModel_.isEmpty();
    this.buttonsEl_.classList.toggle('hidden', isModelEmpty);

    // Show/hide the individual buttons.
    this.buttons_.forEach(b => {
      const enabled = b.isEnabled();
      b.buttonEl.classList.toggle('disabled', !enabled);
      b.buttonEl.classList.toggle('selectable', enabled);
    });
  }

  addButton(treeButton: TreeButton): TreeButtons {
    treeButton.buttonEl.onclick = () => treeButton.handleClick();
    this.buttons_.push(treeButton);
    return this;
  }

  addNavigationButtons(
      leftButtonEl: HTMLElement,
      rightButtonEl: HTMLElement,
      treeNavigator: TreeNavigator): TreeButtons {
    return this
        .addButton({
          buttonEl: leftButtonEl,
          handleClick: () => treeNavigator.selectLeft(),
          isEnabled: () => this.treeModel_.hasPreviousPgn()
        })
        .addButton({
          buttonEl: rightButtonEl,
          handleClick: () => treeNavigator.selectRight(),
          isEnabled: () => this.treeModel_.hasNextPgn()
        });
  }
}
