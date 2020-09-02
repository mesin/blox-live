import { resolveStoreService, StoreService } from '../store-manager/store.service';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import { Catch } from '../decorators';

export default class HttpService {
  protected readonly storeService: StoreService;
  baseUrl: string;
  protected instance: any;

  constructor(storePrefix: string = '') {
    this.storeService = resolveStoreService(storePrefix);
    this.instance = axios.create();
    axiosRetry(this.instance, {
      retries: +process.env.HTTP_RETRIES,
      retryDelay: (retryCount) => {
        return retryCount * +process.env.HTTP_RETRY_DELAY;
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
