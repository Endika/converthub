/* eslint-disable no-console */
import type {
  LogContext,
  LoggerPort,
} from '../../shared-kernel/ports/LoggerPort';

export class ConsoleLogger implements LoggerPort {
  debug(message: string, context?: LogContext): void {
    console.debug(`[DEBUG] ${message}`, context ?? '');
  }

  info(message: string, context?: LogContext): void {
    console.info(`[INFO] ${message}`, context ?? '');
  }

  warn(message: string, context?: LogContext): void {
    console.warn(`[WARN] ${message}`, context ?? '');
  }

  error(message: string, context?: LogContext): void {
    console.error(`[ERROR] ${message}`, context ?? '');
  }
}
