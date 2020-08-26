import { resolveStoreService, StoreService } from '../store-manager/store.service';

export default class HttpService {
  protected readonly storeService: StoreService;
  baseUrl: string;
  protected instance: any;

  constructor(storePrefix: string = '') {
    this.storeService = resolveStoreService(storePrefix);
  }

  request = async (method: string, url: string, data: any = null, fullResponse: boolean = false): Promise<any> => {
    try {
      const response = await this.instance({
        url,
        method,
        data
      });
      return fullResponse ? response: response.data
    } catch (error) {
      throw new Error(`HTTP ${method} request error: ${error}`);
    }
  };
}
