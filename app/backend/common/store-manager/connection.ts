import { Logger } from '../logger/logger';
import Store from './store';
import { Catch, Step } from '../../decorators';

const instances = {};

export default class Connection {
  private static userId: string;
  private logger: Logger;

  static setup(payload: { userId: string, authToken: string, oldPattern?: boolean, prefix?: string }): void {
    Connection.userId = payload.userId;
    instances[Connection.userId] = new Store(payload.prefix);
    instances[Connection.userId].init(payload.userId, payload.authToken, payload.oldPattern);
  }

  static db(prefix: string = ''): Store {
    const name = `${Connection.userId}${prefix}`;
    if (!instances[name]) {
      throw new Error('There is no active store connection');
    }
    return instances[name];
  }

  @Step({
    name: 'Clone configuration settings...'
  })
  @Catch()
  static clone(payload: { fromPrefix: string, toPrefix: string, fields: any, postClean?: { prefix: string, fields?: any } }): void {
    const items = Connection.db(payload.fromPrefix).all();
    Connection.setup({ userId: items.userId, authToken: items.authToken, prefix: payload.toPrefix });
    const data = payload.fields.reduce((aggr, field) => {
      // eslint-disable-next-line no-param-reassign
      aggr[field] = items[field];
      return aggr;
    }, {});
    Connection.db(payload.toPrefix).setMultiple(data);
    const { postClean } = payload;
    if (postClean) {
      if (postClean.fields) {
        postClean.fields.forEach(field => Connection.db(postClean.prefix).delete(field));
      } else {
        Connection.db(postClean.prefix).clear();
      }
    }
  }

  static info(prefix: string = ''): any {
    const name = `${Connection.userId}${prefix}`;
    return {
      userId: Connection.userId,
      connect: instances[name]
     };
  }

  static close(prefix: string = ''): void {
    const name = `${Connection.userId}${prefix}`;
    delete instances[name];
    Connection.userId = null;
  }
}
