import HttpService from './http.service';

class BloxApiService extends HttpService {
  constructor() {
    super();
    this.baseUrl = process.env.API_URL;
  }

  init = () => {
    this.instance.defaults.baseURL = this.baseUrl;
    this.instance.defaults.headers.common['Authorization'] = `Bearer ${this.storeService.get('authToken')}`;
  };
}

const bloxApiService = new BloxApiService();
export default bloxApiService;
