import { ExtraData } from './extradata';
import { ImpressionCode } from './impressioncode';

export interface Impression {
  impressionCode: ImpressionCode,
  user: string,
  timestampMs: number,
  sessionId: string,
  userAgent: string,
  extraData: ExtraData
}
