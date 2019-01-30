import { ImpressionCode } from '../../../protocol/impression/impressioncode';
import { RefreshableView } from '../common/refreshableview';
import { ImpressionSender } from '../impressions/impressionsender';
import { PickerController } from '../picker/pickercontroller';
import { TreeModel } from '../tree/treemodel';
import { CurrentRepertoireUpdater } from './currentrepertoireupdater';
import { ExampleRepertoires } from './examplerepertoires';

export class ExampleRepertoireHandler {
  private impressionSender_: ImpressionSender;
  private treeModel_: TreeModel;
  private modeView_: RefreshableView;
  private pickerController_: PickerController;
  private updater_: CurrentRepertoireUpdater;

  constructor(
      impressionSender: ImpressionSender,
      treeModel: TreeModel,
      modeView: RefreshableView,
      pickerController: PickerController,
      updater: CurrentRepertoireUpdater) {
    this.impressionSender_ = impressionSender;
    this.treeModel_ = treeModel;
    this.modeView_ = modeView;
    this.pickerController_ = pickerController;
    this.updater_ = updater;
  }

  handleButtonClicks(exampleRepertoireElement: HTMLElement): void {
    exampleRepertoireElement.onclick = this.handleClick_.bind(this);
  }

  private handleClick_(): void {
    this.impressionSender_.sendImpression(
        ImpressionCode.LOAD_EXAMPLE_REPERTOIRE);
    const exampleJson = JSON.parse(ExampleRepertoires.KINGS_GAMBIT);
    this.treeModel_.loadRepertoire(exampleJson);
    this.modeView_.refresh();

    this.updater_.updateCurrentRepertoire()
        .then(() => this.pickerController_.updatePicker());
  }
}
