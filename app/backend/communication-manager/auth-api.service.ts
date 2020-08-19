import HttpService from './http.service';
import got from 'got';

export default class AuthApiService extends HttpService {
  constructor(domain: string) {
    super();
    this.instance = got.extend({
      prefixUrl: `https://${domain}/oauth`,
      headers: {
        'content-type': 'application/json'
      }
    });
  }

  request = async (method: string, route: string, payload: any = null): Promise<any> => {
    try {
      const options = {
        method: method
      };
      if (payload) {
        options['body'] = payload;
      }
      const response = await this.instance(route, options);
      return { status: response.statusCode, data: JSON.parse(response.body) };
    } catch (error) {
      throw new Error(`HTTP ${method} request error: ${error}`);
    }
  };
}
