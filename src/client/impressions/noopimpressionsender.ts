import { ExtraData } from '../../protocol/impression/extradata';
import { ImpressionCode } from '../../protocol/impression/impressioncode';
import { ImpressionSender } from './impressionsender';

export class NoOpImpressionSender implements ImpressionSender {
  sendImpression(impressionCode: ImpressionCode, extraData?: ExtraData): void {}
}
