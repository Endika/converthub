import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type MockInstance,
} from 'vitest';
import { ConsoleLogger } from '../ConsoleLogger';

describe('ConsoleLogger', () => {
  let logger: ConsoleLogger;
  let debugSpy: MockInstance;
  let infoSpy: MockInstance;
  let warnSpy: MockInstance;
  let errorSpy: MockInstance;

  beforeEach(() => {
    logger = new ConsoleLogger();
    debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => undefined);
    infoSpy = vi.spyOn(console, 'info').mockImplementation(() => undefined);
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('routes debug to console.debug with context', () => {
    logger.debug('hello', { a: 1 });
    expect(debugSpy).toHaveBeenCalledWith('[DEBUG] hello', { a: 1 });
  });

  it('routes debug to console.debug without context', () => {
    logger.debug('hello');
    expect(debugSpy).toHaveBeenCalledWith('[DEBUG] hello', '');
  });

  it('routes info to console.info with context', () => {
    logger.info('hello', { user: 'alice' });
    expect(infoSpy).toHaveBeenCalledWith('[INFO] hello', { user: 'alice' });
  });

  it('routes info to console.info without context', () => {
    logger.info('hello');
    expect(infoSpy).toHaveBeenCalledWith('[INFO] hello', '');
  });

  it('routes warn to console.warn with context', () => {
    logger.warn('careful', { reason: 'x' });
    expect(warnSpy).toHaveBeenCalledWith('[WARN] careful', { reason: 'x' });
  });

  it('routes warn to console.warn without context', () => {
    logger.warn('careful');
    expect(warnSpy).toHaveBeenCalledWith('[WARN] careful', '');
  });

  it('routes error to console.error with context', () => {
    logger.error('boom', { code: 500 });
    expect(errorSpy).toHaveBeenCalledWith('[ERROR] boom', { code: 500 });
  });

  it('routes error to console.error without context', () => {
    logger.error('boom');
    expect(errorSpy).toHaveBeenCalledWith('[ERROR] boom', '');
  });
});
