const PRIVELEGED_USERS = new Set();
// jven@jvenezue.la
PRIVELEGED_USERS.add('auth0|5bf577320833cd785c67a1da');

export const isPrivelegedUser = function(user: string): boolean {
  return PRIVELEGED_USERS.has(user);
};
