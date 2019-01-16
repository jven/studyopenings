import { LogImpressionsRequest } from '../../protocol/actions';
import { ExtraData } from '../../protocol/impression/extradata';
import { Impression } from '../../protocol/impression/impression';
import { ImpressionCode } from '../../protocol/impression/impressioncode';
import { ImpressionSender } from './impressionsender';

export class ImmediateImpressionSender implements ImpressionSender {
  private sessionId_: string;

  constructor(sessionId: string) {
    this.sessionId_ = sessionId;
  }

  sendImpression(impressionCode: ImpressionCode, extraData: ExtraData): void {
    const impression: Impression = {
      impressionCode: impressionCode,
      user: '(anonymous)',
      timestampMs: Date.now(),
      sessionId: this.sessionId_,
      userAgent: navigator.userAgent,
      extraData: extraData
    };
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.makeRequest_(impression))
    };

    // Errors are intentionally not handled: impressions are not critical so
    // failures are tolerated gracefully by the client.
    fetch('/impressions', options).catch(() => {});
  }

  private makeRequest_(impression: Impression): LogImpressionsRequest {
    return {impressions: [impression]};
  }
}
