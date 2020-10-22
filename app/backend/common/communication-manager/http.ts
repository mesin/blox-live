import Store from '../store-manager/store';
import https from 'https';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import { Catch } from '../../decorators';
import config from '../config';

export default class Http {
  protected readonly store: Store;
  baseUrl: string;
  protected instance: any;

  constructor(storePrefix: string = '') {
    this.store = Store.getStore(storePrefix);
    this.instance = axios.create({
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      })
    });
    axiosRetry(this.instance, {
      retries: +config.env.HTTP_RETRIES,
      retryDelay: (retryCount) => {
        return retryCount * +config.env.HTTP_RETRY_DELAY;
      }
    });
  }

  @Catch()
  async request(method: string, url: string, data: any = null, headers: any = null, fullResponse: boolean = false): Promise<any> {
    const response = await this.instance({
      url,
      method,
      data,
      headers: { ...this.instance.defaults.headers.common, ...headers }
    });
    return fullResponse ? response : response.data;
  }
}
