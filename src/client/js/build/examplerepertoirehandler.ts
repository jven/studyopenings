import { RepertoireModel } from '../common/repertoiremodel';
import { ExampleRepertoires } from './examplerepertoires';
import { RenameInput } from './renameinput';
import { ServerWrapper } from '../common/serverwrapper';
import { TreeView } from './treeview';

export class ExampleRepertoireHandler {
  private repertoireModel_: RepertoireModel;
  private treeView_: TreeView;
  private renameInput_: RenameInput;

  constructor(
      repertoireModel: RepertoireModel,
      server: ServerWrapper,
      treeView: TreeView,
      renameInput: RenameInput) {
    this.repertoireModel_ = repertoireModel;
    this.treeView_ = treeView;
    this.renameInput_ = renameInput;
  }

  handleButtonClicks(exampleRepertoireElement: HTMLElement): void {
    exampleRepertoireElement.onclick = this.handleClick_.bind(this);
  }

  private handleClick_(): void {
    const exampleJson = JSON.parse(ExampleRepertoires.KINGS_GAMBIT);
    this.repertoireModel_.loadExample(exampleJson);
    this.treeView_.refresh();
    this.renameInput_.refresh();
  }
}