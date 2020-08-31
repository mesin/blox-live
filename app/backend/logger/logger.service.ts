// import fs from 'fs';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

export class LoggerService {
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

  /*
  async sendCrashReport(): Promise<void> {
    const BloxApiService = require('../communication-manager/blox-api.service').default;
    console.log('SEND REPORT CRASH');
    const form = new FormData();
    form.append('file', fs.createReadStream('logs/error.log.2020-08-30-14.2'));
    // eslint-disable-next-line no-underscore-dangle
    console.log(`multipart/form-data; boundary=${form._boundary}`);
    await BloxApiService.request(METHOD.POST, 'organizations/crash-report', form, { 'Content-Type': 'multipart/form-data' });
    console.log('---->done crash report');
  }
  */
}
