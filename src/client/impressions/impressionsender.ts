import { ExtraData } from '../../protocol/impression/extradata';
import { ImpressionCode } from '../../protocol/impression/impressioncode';

export interface ImpressionSender {
  sendImpression(impressionCode: ImpressionCode): void,
  sendImpression(impressionCode: ImpressionCode, extraData: ExtraData): void;
}
