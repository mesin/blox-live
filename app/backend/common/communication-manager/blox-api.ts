import Http from './http';

class BloxApi extends Http {
  constructor() {
    super();
    this.baseUrl = process.env.API_URL;
  }

  init = () => {
    this.instance.defaults.baseURL = this.baseUrl;
    this.instance.defaults.headers.common['Authorization'] = `Bearer ${this.store.get('authToken')}`;
  };
}

const bloxApi = new BloxApi();

export default bloxApi;
