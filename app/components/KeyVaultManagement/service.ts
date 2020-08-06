import { PROCESSES } from './constants';
import InstallProcess from '../../backend/proccess-manager/install.process';
import RebootProcess from '../../backend/proccess-manager/reboot.process';
import ReinstallProcess from '../../backend/proccess-manager/reinstall.process';

import Configstore from 'configstore';
import { v4 as uuidv4 } from 'uuid';

export const processInstantiator = (processName: string, storeName: string) => {
  if (processName === PROCESSES.INSTALL) {
    return new InstallProcess(storeName);
  }
  if (processName === PROCESSES.RESTART) {
    return new RebootProcess(storeName);
  }
  if (processName === PROCESSES.REINSTALL) {
    return new ReinstallProcess(storeName);
  }
  return null;
};

export const saveCredentialsInConfigStore = (storeName, credentials) => {
  const conf = new Configstore(storeName);
  if (!conf.get('uuid')) {
    conf.set('uuid', uuidv4());
  }
  conf.set('credentials', credentials);
};

export const isReadyToRunProcess = (storeName) => { // TODO: check with vadim why it's not running (try to pull first)
  const conf = new Configstore(storeName);
  console.log('uuid', conf.get('uuid'));
  console.log('credentials', conf.get('credentials'));
  console.log('authToken', conf.get('authToken'));

  if (conf.get('uuid') && conf.get('credentials') && conf.get('authToken')) {
    return true;
  }
  return false;
};
