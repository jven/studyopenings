export interface AddMoveResult {
  success: boolean,
  failureReason: AddMoveFailureReason | null
}

export enum AddMoveFailureReason {
  ILLEGAL_MOVE = 1,
  EXCEEDED_MAXIMUM_LINE_DEPTH = 2,
  EXCEEDED_MAXIMUM_NUM_NODES = 3
}
