import HttpService from './http.service';
import axios from 'axios';

export default class AuthApiService extends HttpService {
  constructor() {
    super();
    this.baseUrl = `https://${process.env.AUTH0_DOMAIN}/oauth`;
    this.instance = axios.create({
      baseURL: this.baseUrl,
      headers: { 'content-type': 'application/json' }
    });
  }
}
