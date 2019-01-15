export function getUtcDate(now: Date): string {
  const year = zeroFill_(now.getUTCFullYear(), 4);
  const month = zeroFill_(now.getUTCMonth() + 1, 2);
  const day = zeroFill_(now.getUTCDate(), 2);
  return `${year}.${month}.${day}`;
}

export function getUtcTime(now: Date): string {
  const hour = zeroFill_(now.getUTCHours(), 2);
  const minutes = zeroFill_(now.getUTCMinutes(), 2);
  const seconds = zeroFill_(now.getUTCSeconds(), 2);
  return `${hour}:${minutes}:${seconds}`;
}

function zeroFill_(n: number, numDigits: number): string {
  let ans = n.toString();
  for (let i = 0; i < numDigits - ans.length; i++) {
    ans = '0' + ans;
  }
  return ans;
}
