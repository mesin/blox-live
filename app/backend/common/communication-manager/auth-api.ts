import Http from './http';
import axios from 'axios';

export default class AuthApi extends Http {
  constructor() {
    super();
    this.baseUrl = `https://${process.env.AUTH0_DOMAIN}/oauth`;
    this.instance = axios.create({
      baseURL: this.baseUrl,
      headers: { 'content-type': 'application/json' }
    });
  }
}
