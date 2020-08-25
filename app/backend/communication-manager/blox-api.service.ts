import got from 'got';
import HttpService from './http.service';

class BloxApiService extends HttpService {
  readonly baseUrl: string;

  constructor() {
    super();
    this.baseUrl = process.env.API_URL;
  }

  init = () => {
    this.instance = got.extend({
      prefixUrl: this.baseUrl,
      headers: {
        'Authorization': `Bearer ${this.storeService.get('authToken')}`
      }
    });
  };
}

const bloxApiService = new BloxApiService();
export default bloxApiService;
