import got from 'got';
import HttpService from './http.service';

class BloxApiService extends HttpService {
  constructor() {
    super();
  }

  init = () => {
    this.instance = got.extend({
      prefixUrl: process.env.API_URL,
      headers: {
        'Authorization': `Bearer ${this.storeService.get('authToken')}`
      }
    });
  }
}

const bloxApiService = new BloxApiService();
export default bloxApiService;
