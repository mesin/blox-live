import auth0 from 'auth0-js';
import keytar from 'keytar';
import os from 'os';
// import url from 'url';
import jwtDecode from 'jwt-decode';
import axios, { AxiosRequestConfig } from 'axios';

import { SOCIAL_APPS } from '../../common/constants';
import {
  onAxiosInterceptorSuccess,
  onAxiosInterceptorFailure,
} from './service';

export default class Auth {
  tokens: Record<string, any>;
  userProfile: Record<string, any> | null;
  auth: Record<string, any>;
  keytar: Record<string, any>;

  constructor() {
    this.tokens = {
      accessToken: '',
      idToken: '',
      refreshToken: '',
    };
    this.userProfile = null;
    this.auth = new auth0.WebAuth({
      domain: process.env.AUTH0_DOMAIN || '',
      clientID: process.env.AUTH0_CLIENT_ID || '',
      redirectUri: process.env.AUTH0_CALLBACK_URL,
      responseType: 'token id_token',
      scope: 'openid profile email',
    });
    this.keytar = {
      service: 'electron-openid-oauth',
      account: os.userInfo().username,
    };
  }

  login = () => {
    this.auth.authorize();
  };

  loginWithSocialApp = (name: string) => {
    this.auth.authorize({ connection: SOCIAL_APPS[name].connection });
  };

  handleAuthentication = () =>
    new Promise((resolve, reject) => {
      this.auth.parseHash((error: Error, authResult: AuthResult) => {
        if (error) {
          reject(error);
        }
        if (!authResult || !authResult.idToken) {
          return reject(error);
        }
        if (authResult && authResult.accessToken && authResult.idToken) {
          this.setSession(authResult);
          this.interceptIdToken();
          resolve(authResult);
        }
      });
    });

  getAuthenticationURL = () => true; // TODO

  // loadTokens = async (callbackURL) => {
  //   const urlParts = url.parse(callbackURL, true);
  //   const { query } = urlParts;

  //   const exchangeOptions = {
  //     grant_type: 'authorization_code',
  //     client_id: process.env.AUTH0_CLIENT_ID,
  //     code: query.code,
  //     redirect_uri: process.env.AUTH0_CALLBACK_URL,
  //   };

  //   const options = {
  //     method: 'POST',
  //     url: `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
  //     headers: {
  //       'content-type': 'application/json',
  //     },
  //     data: JSON.stringify(exchangeOptions),
  //   };

  //   try { // TODO: write inside setSession
  //     const response = await axios(options);
  //     this.setSession(response);
  //   } catch (error) {
  //     await this.logout();
  //     throw error;
  //   }
  // };

  setSession = async (response: AuthResult) => {
    this.tokens.accessToken = response.data.access_token;
    this.userProfile = jwtDecode(response.data.id_token);
    this.tokens.refreshToken = response.data.refresh_token;

    if (this.tokens.refreshToken) {
      await keytar.setPassword(
        this.keytar.service,
        this.keytar.account,
        this.tokens.refreshToken
      );
    }
  };

  isLoggedIn = () => {
    const expiresAt = localStorage.getItem('expires_at');
    return new Date().getTime() < Number(expiresAt);
  };

  getAccessToken = () => this.tokens.accessToken;

  getIdToken = () => {
    const idToken = localStorage.getItem('id_token');
    if (!idToken) {
      throw new Error('No id token found.');
    }
    return idToken;
  };

  getProfile = (cb: CallBack) => {
    if (this.userProfile) {
      return cb(this.userProfile);
    }
    this.auth.client.userInfo(
      this.getAccessToken(),
      (error: Error, profile: Profile) => {
        if (profile) this.userProfile = profile;
        cb(profile, error);
      }
    );
  };

  interceptIdToken = () => {
    const idToken: string = this.getIdToken();
    axios.interceptors.request.use(
      (config: AxiosRequestConfig) =>
        onAxiosInterceptorSuccess(config, idToken),
      onAxiosInterceptorFailure
    );
  };

  logout = async () => {
    const { service, account } = this.keytar;
    await keytar.deletePassword(service, account);
    this.tokens = {
      accessToken: null,
      profile: null,
      refreshToken: null,
    };
    this.userProfile = null;
    await this.auth.logout({
      clientID: process.env.AUTH0_CLIENT_ID,
      returnTo: process.env.AUTH0_LOGOUT_URL,
    });
  };

  getLogOutUrl() {
    return `https://${process.env.AUTH0_DOMAIN}/v2/logout`;
  }
}

type AuthResult = Record<string, any> | null;
type Profile = Record<string, any> | null;
type Error = Record<string, any> | null;
type CallBack = (profile: Profile, error?: Error) => void;
