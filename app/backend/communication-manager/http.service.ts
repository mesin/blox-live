import { resolveStoreService, StoreService } from '../store-manager/store.service';

export default class HttpService {
  protected readonly storeService: StoreService;
  protected instance: any;

  constructor(storePrefix: string = '') {
    this.storeService = resolveStoreService(storePrefix);
  }

  request = async (method: string, route: string, payload: any = null): Promise<any> => {
    try {
      const options = {
        method: method
      };
      if (payload) {
        options['json'] = payload;
      }
      const { body } = await this.instance(route, options);
      return body;
    } catch (error) {
      throw new Error(`HTTP ${method} request error: ${error}`);
    }
  };
}
