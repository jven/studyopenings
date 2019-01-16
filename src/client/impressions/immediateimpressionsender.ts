import { LogImpressionsRequest } from '../../protocol/actions';
import { ExtraData } from '../../protocol/impression/extradata';
import { Impression } from '../../protocol/impression/impression';
import { ImpressionCode } from '../../protocol/impression/impressioncode';
import { AuthManager } from '../js/auth/authmanager';
import { ImpressionSender } from './impressionsender';

export class ImmediateImpressionSender implements ImpressionSender {
  private impressionSessionId_: string;
  private authManager_: AuthManager;

  constructor(impressionSessionId: string, authManager: AuthManager) {
    this.impressionSessionId_ = impressionSessionId;
    this.authManager_ = authManager;
  }

  sendImpression(impressionCode: ImpressionCode, extraData: ExtraData): void {
    const sessionInfo = this.authManager_.getSessionInfo();
    const user = sessionInfo ? sessionInfo.userId : '(anonymous)';
    const impression: Impression = {
      impressionCode: impressionCode,
      user: user,
      timestampMs: Date.now(),
      sessionId: this.impressionSessionId_,
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
