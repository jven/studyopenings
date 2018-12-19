import { Mode } from './mode';
import { ModeManager } from './modemanager';

const MockMode = jest.fn<Mode>(() => ({
  preEnter: jest.fn(() => Promise.resolve()),
  exit: jest.fn(() => Promise.resolve()),
  postEnter: jest.fn(() => Promise.resolve()),
  onKeyDown: jest.fn(),
  notifySelectedMetadata: jest.fn(() => Promise.resolve())
}));

describe('register', () => {
  test('register twice throws', () => {
    const modeManager = new ModeManager();
    modeManager.registerMode('mode', new MockMode());
    expect(() => modeManager.registerMode('mode', new MockMode()))
        .toThrow();
  });

  test('register does not select', () => {
    const modeManager = new ModeManager();
    const mode = new MockMode();
    modeManager.registerMode('mode', mode);
    expect(mode.preEnter).toHaveBeenCalledTimes(0);
    expect(mode.exit).toHaveBeenCalledTimes(0);
    expect(mode.postEnter).toHaveBeenCalledTimes(0);
  });
});

describe('select', () => {
  test('get selected without selecting throws', () => {
    const modeManager = new ModeManager();
    modeManager.registerMode('mode', new MockMode());
    expect(() => modeManager.getSelectedMode()).toThrow();
  });

  test('select unregistered mode throws', () => {
    const modeManager = new ModeManager();
    modeManager.registerMode('mode1', new MockMode());
    expect(() => modeManager.selectModeType('mode2'))
        .toThrow();
  });

  test('select single mode', () => {
    const modeManager = new ModeManager();
    const mode = new MockMode();
    modeManager.registerMode('mode', mode);
    return modeManager.selectModeType('mode')
        .then(() => {
          expect(modeManager.getSelectedMode()).toBe(mode);

          expect(mode.preEnter).toHaveBeenCalledTimes(1);
          expect(mode.exit).toHaveBeenCalledTimes(0);
          expect(mode.postEnter).toHaveBeenCalledTimes(1);
        })
  });

  test('switch modes', () => {
    const modeManager = new ModeManager();
    const mode1 = new MockMode();
    const mode2 = new MockMode();
    modeManager
        .registerMode('mode1', mode1)
        .registerMode('mode2', mode2);
    return modeManager.selectModeType('mode1')
        .then(() => modeManager.selectModeType('mode2'))
        .then(() => {
          expect(modeManager.getSelectedMode()).toBe(mode2);

          expect(mode1.preEnter).toHaveBeenCalledTimes(1);
          expect(mode1.exit).toHaveBeenCalledTimes(1);
          expect(mode1.postEnter).toHaveBeenCalledTimes(1);

          expect(mode2.preEnter).toHaveBeenCalledTimes(1);
          expect(mode2.exit).toHaveBeenCalledTimes(0);
          expect(mode2.postEnter).toHaveBeenCalledTimes(1);
        });
  });
});