import { LogImpressionsRequest } from '../../protocol/actions';
import { ExtraData } from '../../protocol/impression/extradata';
import { Impression } from '../../protocol/impression/impression';
import { ImpressionCode } from '../../protocol/impression/impressioncode';
import { AuthManager } from '../js/auth/authmanager';
import { Debouncer } from '../js/common/debouncer';
import { ImpressionSender } from './impressionsender';

export class DebouncingImpressionSender implements ImpressionSender {
  private impressionSessionId_: string;
  private authManager_: AuthManager;
  private impressionsToSend_: Impression[];
  private debouncer_: Debouncer;

  constructor(
      impressionSessionId: string,
      authManager: AuthManager,
      debounceIntervalMs: number) {
    this.impressionSessionId_ = impressionSessionId;
    this.authManager_ = authManager;
    this.impressionsToSend_ = [];
    this.debouncer_ = new Debouncer(
        () => this.sendImpressions_(), debounceIntervalMs);
  }

  sendImpression(impressionCode: ImpressionCode, extraData?: ExtraData): void {
    const sessionInfo = this.authManager_.getSessionInfo();
    const user = sessionInfo ? sessionInfo.userId : '(anonymous)';
    const impression: Impression = {
      impressionCode: impressionCode,
      user: user,
      timestampMs: Date.now(),
      sessionId: this.impressionSessionId_,
      userAgent: navigator.userAgent,
      extraData: extraData || {}
    };

    this.impressionsToSend_.push(impression);
    this.debouncer_.fire();
  }

  private sendImpressions_(): void {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.makeRequest_())
    };

    // Errors are intentionally not handled: impressions are not critical so
    // failures are tolerated gracefully by the client.
    fetch('/impressions', options).catch(() => { });

    this.impressionsToSend_ = [];
  }

  private makeRequest_(): LogImpressionsRequest {
    return {impressions: this.impressionsToSend_};
  }
}
