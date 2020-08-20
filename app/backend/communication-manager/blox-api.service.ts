import got from 'got';
import HttpService from './http.service';

export default class BloxApiService extends HttpService {
  constructor() {
    super();
    this.instance = got.extend({
      prefixUrl: process.env.API_URL,
      headers: {
        'Authorization': `Bearer ${this.storeService.get('authToken')}`
      }
    });
  }
}
