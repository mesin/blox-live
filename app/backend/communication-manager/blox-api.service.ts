import axios from 'axios';
// eslint-disable-next-line import/no-cycle
import HttpService from './http.service';

class BloxApiService extends HttpService {
  constructor() {
    super();
    this.baseUrl = process.env.API_URL;
  }

  init = () => {
    this.instance = axios.create({
      baseURL: this.baseUrl,
      headers: { 'Authorization': `Bearer ${this.storeService.get('authToken')}` }
    });
  };
}

const bloxApiService = new BloxApiService();
export default bloxApiService;
