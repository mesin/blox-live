import StoreService from '../store-manager/store.service';

export default class HttpService {
  protected readonly storeService: StoreService;
  protected instance: any;

  constructor() {
    this.storeService = new StoreService();
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
