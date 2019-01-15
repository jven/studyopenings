export class Debouncer {
  private callbackFn_: () => void;
  private debounceIntervalMs_: number;
  private currentTimeout_: number | null;
  private firedDuringTimeout_: boolean;

  constructor(callbackFn: () => void, debounceIntervalMs: number) {
    this.callbackFn_ = callbackFn;
    this.debounceIntervalMs_ = debounceIntervalMs;
    this.currentTimeout_ = null;
    this.firedDuringTimeout_ = false;
  }

  fire(): void {
    if (this.currentTimeout_ != null) {
      this.firedDuringTimeout_ = true;
      return;
    }

    this.callbackFn_();
    this.firedDuringTimeout_ = false;
    this.currentTimeout_ = window.setTimeout(
        () => this.maybeFireAfterTimeout_(), this.debounceIntervalMs_);
  }

  private maybeFireAfterTimeout_(): void {
    this.currentTimeout_ = null;
    if (!this.firedDuringTimeout_) {
      return;
    }

    this.firedDuringTimeout_ = false;
    this.fire();
  }
}
