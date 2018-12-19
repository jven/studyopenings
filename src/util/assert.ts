export function assert<T>(x: T | null): T;
export function assert<T>(x: T | undefined): T {
  if (!x) {
    throw new Error('Expected non-null and non-undefined.');
  }
  return x;
}