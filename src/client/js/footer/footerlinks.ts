import { ImpressionCode } from '../../../protocol/impression/impressioncode';
import { ImpressionSender } from '../../impressions/impressionsender';

export class FooterLinks {
  static logImpressionsForClicks(
      impressionSender: ImpressionSender,
      aboutLinkEl: HTMLElement,
      sourceCodeLinkEl: HTMLElement): void {
    aboutLinkEl.onclick = () => impressionSender.sendImpression(
        ImpressionCode.OPEN_ABOUT_PAGE);
    sourceCodeLinkEl.onclick = () => impressionSender.sendImpression(
        ImpressionCode.OPEN_SOURCE_CODE);
  }
}
