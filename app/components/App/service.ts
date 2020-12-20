import { notification } from 'antd';
import {remote} from 'electron';

export const initApp = () => {
  const placement = 'bottomRight';
  notification.config({ placement });
};

export const deepLink = (setSession, loginFailure) => {
  remote.app.on('open-url', (event, data) => {
    if (data) {
      const questionMarkIndex = data.indexOf('//');
      const trimmedCode = data.substring(questionMarkIndex + 2);
      try {
        setSession(trimmedCode);
      }
      catch (e) {
        loginFailure(e);
      }
    }
  });

  remote.app.on('second-instance', (event, commandLine) => {
    if (commandLine[2].includes('blox-live://')) {
      const questionMarkIndex = commandLine[2].indexOf('//');
      const trimmedCode = commandLine[2].substring(questionMarkIndex + 2);
      const withoutSlash = trimmedCode.slice(0, trimmedCode.length - 1);
      try {
        setSession(withoutSlash);
      }
      catch (e) {
        loginFailure(e);
      }
    }
  });
};
