import url from 'url';
import jwtDecode from 'jwt-decode';
import { SOCIAL_APPS } from 'common/constants';
import { createAuthWindow } from './Auth-Window';
import { createLogoutWindow } from './Logout-Window';
import { store } from '../../backend/common/store-manager/store';
import BloxApi from '../../backend/common/communication-manager/blox-api';
import AuthApi from '../../backend/common/communication-manager/auth-api';

export default class Auth {
  tokens: Record<string, any>;
  userProfile: Record<string, any> | null;
  auth: Record<string, any>;
  private readonly authApi: AuthApi;

  constructor() {
    this.tokens = {
      idToken: '',
    };
    this.userProfile = null;
    this.auth = {
      domain: process.env.AUTH0_DOMAIN || '',
      clientID: process.env.AUTH0_CLIENT_ID || '',
      redirectUri: process.env.AUTH0_CALLBACK_URL,
      responseType: 'code',
      scope: 'openid profile email offline_access'
    };
    this.authApiService = new AuthApiService();
  }

  loginWithSocialApp = async (name: string) => {
    return new Promise((resolve, reject) => {
      const onSuccess = (response) => {
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
      const onFailure = () => reject(new Error('Authentication window closed'));
      createAuthWindow(this, name, onSuccess, onFailure);
    });
  };

  getAuthenticationURL = (socialAppName) => {
    const { domain, clientID, redirectUri, responseType, scope } = this.auth;
    return `https://${domain}/authorize?scope=${scope}&response_type=${responseType}&client_id=${clientID}&connection=${SOCIAL_APPS[socialAppName].connection}&redirect_uri=${redirectUri}&prompt=select_account`;
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
      return await this.authApiService.request('POST', 'token', JSON.stringify(exchangeOptions), null, true);
    } catch (error) {
      await this.logout();
      return Error(error);
    }
  };

  setSession = async (authResult, userProfile) => {
    const { id_token } = authResult;
    this.tokens.idToken = id_token;
    this.userProfile = userProfile;
    storeService.init(userProfile.sub, authResult.id_token);
    BloxApiService.init();
  };

  isLoggedIn = () => {
    const expiresAt = localStorage.getItem('expires_at');
    return new Date().getTime() < Number(expiresAt);
  };

  getIdToken = () => this.tokens.idToken;

  getProfile = (cb: CallBack) => cb(this.userProfile, null);

  logout = async () => { // TODO: check https://auth0.com/docs/logout/log-users-out-of-idps
    await createLogoutWindow(`https://${this.auth.domain}/v2/logout?client_id=${this.auth.clientID}&federated`);
    storeService.logout();
    this.tokens = {
      idToken: '',
      profile: null,
    };
    this.userProfile = null;
  };
}

type Profile = Record<string, any> | null;
type Error = Record<string, any> | null;
type CallBack = (profile: Profile, error?: Error) => void;
