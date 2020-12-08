import { Logger } from '../logger/logger';
import Store from './store';
import { Catch, Step } from '../../decorators';

const instances = {};

export default class Connection {
  private static userId: string;
  private logger: Logger;

  static setup(payload: { currentUserId: string, authToken: string, prefix?: string }): void {
    Connection.userId = payload.currentUserId;
    const name = `${payload.currentUserId}${payload.prefix || ''}`;
    instances[name] = new Store(payload.prefix);
    instances[name].init(payload.currentUserId, payload.authToken);
    console.log('DB SETUP:', Connection.userId, instances[name]);
  }

  static db(prefix: string = ''): Store {
    const name = `${Connection.userId}${prefix}`;
    if (!instances[name]) {
      throw new Error('There is no active store connection');
    }
    console.log('DB:', name, instances[name].get('uuid'));
    return instances[name];
  }

  static cloneCryptoKey(payload: { fromPrefix: string, toPrefix: string }): void {
    Connection.db(payload.toPrefix).cryptoKey = Connection.db(payload.fromPrefix).cryptoKey;
    console.log('set toprefix cryptokey', Connection.db(payload.toPrefix).cryptoKey, 'from:', Connection.db(payload.toPrefix).get('credentials'));
  }

  @Step({
    name: 'Clone configuration settings...'
  })
  @Catch({
    showErrorMessage: true
  })
  static clone(payload: { fromPrefix: string, toPrefix: string, fields: any, postClean?: { prefix: string, fields?: any } }): void {
    const items = Connection.db(payload.fromPrefix).all();
    const data = payload.fields.reduce((aggr, field) => {
      // eslint-disable-next-line no-param-reassign
      aggr[field] = items[field];
      return aggr;
    }, {});
    Connection.db(payload.toPrefix).setMultiple(data);
    console.log('clone cryptkey', Connection.db(payload.toPrefix).cryptoKey, Connection.db(payload.toPrefix).get('credentials'))
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
