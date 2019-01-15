import { Debouncer } from './debouncer';

let callbackFn: () => void;
let debouncer: Debouncer;

const DEBOUNCE_INTERVAL_MS = 10;

beforeEach(() => {
  jest.useFakeTimers();
  callbackFn = jest.fn();
  debouncer = new Debouncer(callbackFn, DEBOUNCE_INTERVAL_MS);
});

it('no fire should not call callback', () => {
  jest.advanceTimersByTime(DEBOUNCE_INTERVAL_MS * 2);
  expect(callbackFn).toBeCalledTimes(0);
});

it('fire should call callback immediately and only once', () => {
  debouncer.fire();
  expect(callbackFn).toBeCalledTimes(1);
  
  jest.advanceTimersByTime(DEBOUNCE_INTERVAL_MS * 2);
  expect(callbackFn).toBeCalledTimes(1);
});

it('fire twice slowly should call twice immediately', () => {
  debouncer.fire();
  jest.advanceTimersByTime(DEBOUNCE_INTERVAL_MS * 2);
  debouncer.fire();
  expect(callbackFn).toBeCalledTimes(2);
  
  jest.advanceTimersByTime(DEBOUNCE_INTERVAL_MS * 2);
  expect(callbackFn).toBeCalledTimes(2);
});

it('fire twice immediately should call once immediately, once delayed', () => {
  debouncer.fire();
  debouncer.fire();
  expect(callbackFn).toBeCalledTimes(1);
  
  jest.advanceTimersByTime(DEBOUNCE_INTERVAL_MS * 2);
  expect(callbackFn).toBeCalledTimes(2);

  jest.advanceTimersByTime(DEBOUNCE_INTERVAL_MS * 2);
  expect(callbackFn).toBeCalledTimes(2);
});

it('fire twice quickly should call once immediately, once delayed', () => {
  debouncer.fire();
  jest.advanceTimersByTime(DEBOUNCE_INTERVAL_MS - 1);
  debouncer.fire();
  expect(callbackFn).toBeCalledTimes(1);
  
  jest.advanceTimersByTime(DEBOUNCE_INTERVAL_MS * 2);
  expect(callbackFn).toBeCalledTimes(2);

  jest.advanceTimersByTime(DEBOUNCE_INTERVAL_MS * 2);
  expect(callbackFn).toBeCalledTimes(2);
});

it('fire many times quickly should call once immediately, once delayed', () => {
  const numQuickFires = 100;
  for (let i = 0; i < numQuickFires; i++) {
    debouncer.fire();
  }
  expect(callbackFn).toBeCalledTimes(1);
  
  jest.advanceTimersByTime(DEBOUNCE_INTERVAL_MS * 2);
  expect(callbackFn).toBeCalledTimes(2);

  jest.advanceTimersByTime(DEBOUNCE_INTERVAL_MS * 2);
  expect(callbackFn).toBeCalledTimes(2);
});

it('fire many times slowly should space out calls', () => {
  const numLoops = 100;
  for (let i = 0; i < numLoops; i++) {
    debouncer.fire();
    jest.advanceTimersByTime(1);
    debouncer.fire();
    jest.advanceTimersByTime(DEBOUNCE_INTERVAL_MS * 2);
  }

  expect(callbackFn).toBeCalledTimes(numLoops * 2);
});
