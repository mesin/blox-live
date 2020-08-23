import got from 'got';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

import { storeService } from '../store-manager/store.service';

export default class LoggerService {
  private readonly logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.json(),
      defaultMeta: {
        service: 'user-service'
      },
      transports: [
        new winston.transports.DailyRotateFile({
          filename: 'logs/error.log',
          datePattern: 'YYYY-MM-DD-HH',
          maxSize: '1k',
          maxFiles: 1,
          // zippedArchive: true,
          level: 'error'
        }),
        new winston.transports.DailyRotateFile({
          filename: 'logs/debug.log',
          datePattern: 'YYYY-MM-DD-HH',
          maxSize: '1k',
          maxFiles: 1,
          // zippedArchive: true,
          level: 'debug'
        })
      ]
    });
  }

  error(message: string, trace?: any): void {
    this.logger.error(message, trace);
  }

  debug(message: string, trace?: any): void {
    this.logger.debug(message, trace);
  }

  async sendCrashReport(): Promise<void> {
    await got.post('https://api.stage.bloxstaking.com/users/crash-report', {
      headers: {
        'Authorization': `Bearer ${storeService.get('authToken')}`
      }
    });
  }
}
