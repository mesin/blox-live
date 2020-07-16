import { notification } from 'antd';

export const initApp = (auth) => {
  auth.isLoggedIn() && auth.interceptIdToken();
  const placement = 'bottomRight';
  notification.config({ placement });
};
