import cryptoRandomString = require('crypto-random-string');

export function getRandomString(length: number): string {
  return cryptoRandomString(length);
}
