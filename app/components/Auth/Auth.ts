import auth0 from 'auth0-js';
import keytar from 'keytar';
import os from 'os';
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

  setSession = (authResult: AuthResult) => {
    if (authResult) {
      const expiresAt = JSON.stringify(
        authResult.expiresIn * 1000 + new Date().getTime()
      );
      localStorage.setItem('access_token', authResult.accessToken);
      localStorage.setItem('id_token', authResult.idToken);
      localStorage.setItem('expires_at', expiresAt);
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
