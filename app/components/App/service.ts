import { notification } from 'antd';

export const initApp = (isLoggedIn, auth) => {
  isLoggedIn && auth.interceptIdToken();
  const placement = 'bottomRight';
  notification.config({ placement });
};
