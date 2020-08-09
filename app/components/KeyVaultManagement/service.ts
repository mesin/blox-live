import { PROCESSES } from './constants';
import InstallProcess from '../../backend/proccess-manager/install.process';
import RebootProcess from '../../backend/proccess-manager/reboot.process';
import ReinstallProcess from '../../backend/proccess-manager/reinstall.process';
import RestoreProcess from '../../backend/proccess-manager/restore.process';

import ElectronStore from 'electron-store';
import { v4 as uuidv4 } from 'uuid';

const storeName: string = 'blox';

export const processInstantiator = (processName: string) => {
  if (processName === PROCESSES.INSTALL) {
    return new InstallProcess(storeName);
  }
  if (processName === PROCESSES.RESTART) {
    return new RebootProcess(storeName);
  }
  if (processName === PROCESSES.REINSTALL) {
    return new ReinstallProcess(storeName);
  }
  if (processName === PROCESSES.RESTORE) {
    return new RestoreProcess(storeName);
  }
  return null;
};

export const saveCredentialsInElectronStore = (credentials) => {
  const conf = new ElectronStore({name: storeName});
  if (!conf.get('uuid')) {
    conf.set('uuid', uuidv4());
  }
  conf.set('credentials', credentials);
};

export const saveMnemonicInElectronStore = (mnemonic) => {
  const conf = new ElectronStore({name: storeName});
  if (!conf.get('mnemonic')) {
    conf.set('mnemonic', mnemonic);
  }
};

export const isReadyToRunProcess = () => {
  const conf = new ElectronStore({name: storeName});
  console.log('uuid', conf.get('uuid'));
  console.log('credentials', conf.get('credentials'));
  console.log('authToken', conf.get('authToken'));

  if (conf.get('uuid') && conf.get('credentials') && conf.get('authToken')) {
    return true;
  }
  return false;
};
