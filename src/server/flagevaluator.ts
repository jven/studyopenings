import { FLAG_MAP } from '../flag/flags';
import { RolloutState } from '../flag/rolloutstate';
import { EvaluatedFlags } from '../protocol/evaluatedflags';

export class FlagEvaluator {
  static evaluateAllFlags(): EvaluatedFlags {
    const allFlags: EvaluatedFlags = {};
    FLAG_MAP.forEach((rolloutState, flagName) => {
      allFlags[flagName] = FlagEvaluator.isRolloutStateEnabled_(rolloutState);
    });

    return allFlags;
  }

  private static isRolloutStateEnabled_(
      rolloutState: RolloutState): boolean {
    switch (rolloutState) {
      case RolloutState.LOCAL_ONLY:
        return !!process.env.ENABLE_LOCAL_FLAGS;
      case RolloutState.ENABLED_EVERYWHERE:
        return true;
      default:
        throw new Error('Unknown rollout state: ' + rolloutState);
    }
  }
}