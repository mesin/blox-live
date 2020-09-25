import { notification } from 'antd';

export const initApp = () => {
  const placement = 'bottomRight';
  notification.config({ placement });
};
