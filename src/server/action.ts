import { CheckRequestResult } from './checkrequestresult';

/**
 * An interface for actions exposed by the server. Conceptually, these are
 * POST endpoints exposed by the server.
 *
 * Each action takes a request type and returns a response type. These types are
 * unique to this action and are declared in the protocol folder as they are
 * shared with the client.
 */
export interface Action<REQUEST, RESPONSE> {
  checkRequest(request: REQUEST, user: string | null):
      Promise<CheckRequestResult>;

  /**
   * Does the action with the given request for the given user. The user is null
   * if the user is anonymous.
   *
   * Returns a promise of the response.
   */
  do(request: REQUEST, user: string | null): Promise<RESPONSE>;
}
