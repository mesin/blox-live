import Http from './http';
import config from '../config';
import Connection from '../store-manager/connection';
export default class BloxApi extends Http {
  private storePrefix: string;

  constructor(prefix: string = '') {
    super();
    this.storePrefix = prefix;
    this.baseUrl = config.env.API_URL;
  }

  init = () => {
    this.instance.defaults.baseURL = this.baseUrl;
    this.instance.defaults.headers.common.Authorization = `Bearer ${Connection.db(this.storePrefix).get('authToken')}`;
  };
}
