import fs from 'fs';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import FormData from 'form-data';

// eslint-disable-next-line import/no-cycle
import BloxApiService from '../communication-manager/blox-api.service';
import { METHOD } from '../communication-manager/constants';

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
        new winston.transports.Console(),
        new winston.transports.DailyRotateFile({
          filename: 'logs/error.log',
          datePattern: 'YYYY-MM-DD-HH',
          maxSize: '10k',
          maxFiles: 1,
          // zippedArchive: true,
          level: 'error'
        }),
        new winston.transports.DailyRotateFile({
          filename: 'logs/debug.log',
          datePattern: 'YYYY-MM-DD-HH',
          maxSize: '10k',
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
    console.log('SEND REPORT CRASH');
    const form = new FormData();
    form.append('file', fs.createReadStream('logs/error.log.2020-08-30-14.2'));
    console.log(form);
    await BloxApiService.request(METHOD.POST, 'users/crash-report', form);
    /*
    await got.post('https://api.stage.bloxstaking.com/users/crash-report', {
      headers: {
        'Authorization': `Bearer ${storeService.get('authToken')}`
      }
    });
    */
  }
}
