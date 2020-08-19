import got from 'got';
import HttpService from './http.service';

// TODO import from .env
const bloxHost = 'https://api.stage.bloxstaking.com';

export default class BloxApiService extends HttpService{
  constructor() {
    super();
    this.instance = got.extend({
      prefixUrl: bloxHost,
      headers: {
        'Authorization': `Bearer ${this.storeService.get('authToken')}`
      }
    });
  }
}
