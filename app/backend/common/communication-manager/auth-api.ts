import Http from './http';
import axios from 'axios';
import config from '../config';

export default class AuthApi extends Http {
  constructor() {
    super();
    this.baseUrl = `https://${config.env.AUTH0_DOMAIN}/oauth`;
    this.instance = axios.create({
      baseURL: this.baseUrl,
      headers: { 'content-type': 'application/json' }
    });
  }
}
