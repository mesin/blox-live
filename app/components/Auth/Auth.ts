import keytar from 'keytar';
import os from 'os';
import url from 'url';
import jwtDecode from 'jwt-decode';
import { SOCIAL_APPS } from '../../common/constants';
import { createAuthWindow } from './Auth-Window';
import { createLogoutWindow } from './Logout-Window';
import { storeService } from '../../backend/store-manager/store.service';
import BloxApiService from '../../backend/communication-manager/blox-api.service';
import AuthApiService from '../../backend/communication-manager/auth-api.service';

export default class Auth {
  tokens: Record<string, any>;
  userProfile: Record<string, any> | null;
  auth: Record<string, any>;
  keytar: Record<string, any>;
  private readonly authApiService: AuthApiService;

  constructor() {
    this.tokens = {
      accessToken: '',
      idToken: '',
      refreshToken: ''
    };
    this.userProfile = null;
    this.auth = {
      domain: process.env.AUTH0_DOMAIN || '',
      clientID: process.env.AUTH0_CLIENT_ID || '',
      redirectUri: process.env.AUTH0_CALLBACK_URL,
      responseType: 'code',
      scope: 'openid profile email offline_access'
    };
    this.keytar = {
      service: 'bloxstaking-openid-oauth',
      account: os.userInfo().username
    };
    this.authApiService = new AuthApiService();
  }

  loginWithSocialApp = async (name: string) => {
    return new Promise((resolve, reject) => {
      const callBack = (response) => {
        if (response.status === 200) {
          const userProfile = jwtDecode(response.data.id_token);
          this.setSession(response.data, userProfile);
          resolve({
            idToken: response.data.id_token,
            idTokenPayload: userProfile
          });
        }
        reject(new Error('Error in login'));
      };
      createAuthWindow(this, name, callBack);
    });
  };

  checkIfTokensExist = async () => {
    return new Promise((resolve, reject) => {
      const callBack = (response) => {
        if (response.status === 200) {
          const userProfile = jwtDecode(response.data.id_token);
          this.setSession(response.data, userProfile);
          resolve({
            idToken: response.data.id_token,
            idTokenPayload: userProfile
          });
        }
        reject(new Error(response));
      };
      this.loadRefreshToken(callBack);
    });
  };

  getAuthenticationURL = (socialAppName) => {
    const { domain, clientID, redirectUri, responseType, scope } = this.auth;
    return `https://${domain}/authorize?scope=${scope}&response_type=${responseType}&client_id=${clientID}&connection=${SOCIAL_APPS[socialAppName].connection}&redirect_uri=${redirectUri}&prompt=select_account`;
  };

  loadRefreshToken = async (callBack) => {
    const { clientID } = this.auth;
    const { service, account } = this.keytar;
    const refreshToken = await keytar.getPassword(service, account);
    if (refreshToken) {
      const payload = {
        grant_type: 'refresh_token',
        client_id: clientID,
        refresh_token: refreshToken
      };
      try {
        const response = await this.authApiService.request('POST', 'token', payload, true);
        return callBack(response);
      } catch (error) {
        await this.logout();
        return callBack(Error(error));
      }
    } else {
      return callBack(Error('No available refresh token.'));
    }
  };

  loadAuthToken = async (callbackURL) => {
    const { clientID, redirectUri } = this.auth;
    const urlParts = url.parse(callbackURL, true);
    const { query } = urlParts;
    const exchangeOptions = {
      grant_type: 'authorization_code',
      client_id: clientID,
      code: query.code,
      redirect_uri: redirectUri
    };

    try {
      return await this.authApiService.request('POST', 'token', JSON.stringify(exchangeOptions), true);
    } catch (error) {
      await this.logout();
      return Error(error);
    }
  };

  setSession = async (authResult, userProfile) => {
    const { access_token, id_token, refresh_token } = authResult;
    this.tokens.accessToken = access_token;
    this.tokens.idToken = id_token;
    this.tokens.refreshToken = refresh_token;
    this.userProfile = userProfile;
    storeService.init(userProfile.sub, authResult.id_token);
    BloxApiService.init();
    console.log('SET SESSION', authResult, userProfile);
    console.log('electronStore===>', storeService);
    if (refresh_token) {
      await keytar.setPassword(
        this.keytar.service,
        this.keytar.account,
        refresh_token
      );
    }
  };

  isLoggedIn = () => {
    const expiresAt = localStorage.getItem('expires_at');
    return new Date().getTime() < Number(expiresAt);
  };

  getAccessToken = () => this.tokens.accessToken; // TODO: add electron-storage

  getIdToken = () => this.tokens.idToken;

  getProfile = (cb: CallBack) => {
    // TODO: get /userinfo in case userProfile is null
    return cb(this.userProfile, null);
  };

  logout = async () => { // check the keytar
    const { service, account } = this.keytar;
    await createLogoutWindow(`https://${this.auth.domain}/v2/logout?client_id=${this.auth.clientID}`);
    await keytar.deletePassword(service, account);
    storeService.logout();
    this.tokens = {
      accessToken: null,
      profile: null,
      refreshToken: null
    };
    this.userProfile = null;
  };
}

type Profile = Record<string, any> | null;
type Error = Record<string, any> | null;
type CallBack = (profile: Profile, error?: Error) => void;
