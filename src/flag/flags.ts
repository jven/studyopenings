import { RolloutState } from './rolloutstate';

export enum FlagName {
  ENABLE_EVALUATE_MODE = 'enable_evaluate_mode',
  ENABLE_PICKER_DELETE_CONFIRM = 'enable_picker_delete_confirm'
}

export const FLAG_MAP: Map<FlagName, RolloutState> = new Map();
FLAG_MAP
    .set(
      FlagName.ENABLE_EVALUATE_MODE,
        RolloutState.LOCAL_ONLY)
    .set(
        FlagName.ENABLE_PICKER_DELETE_CONFIRM,
        RolloutState.ENABLED_EVERYWHERE);
