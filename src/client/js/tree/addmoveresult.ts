export interface AddMoveResult {
  success: boolean,
  failureReason: AddMoveFailureReason | null
}

export enum AddMoveFailureReason {
  ILLEGAL_MOVE = 1
}
