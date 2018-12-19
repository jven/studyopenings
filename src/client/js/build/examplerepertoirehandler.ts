import { RepertoireModel } from '../common/repertoiremodel';
import { ExampleRepertoires } from './examplerepertoires';
import { ServerWrapper } from '../common/serverwrapper';
import { TreeView } from './treeview';

export class ExampleRepertoireHandler {
  private repertoireModel_: RepertoireModel;
  private treeView_: TreeView;

  constructor(
      repertoireModel: RepertoireModel,
      server: ServerWrapper,
      treeView: TreeView) {
    this.repertoireModel_ = repertoireModel;
    this.treeView_ = treeView;
  }

  handleButtonClicks(exampleRepertoireElement: HTMLElement): void {
    exampleRepertoireElement.onclick = this.handleClick_.bind(this);
  }

  private handleClick_(): void {
    const exampleJson = JSON.parse(ExampleRepertoires.KINGS_GAMBIT);
    this.repertoireModel_.loadExample(exampleJson);
    this.treeView_.refresh();
  }
}