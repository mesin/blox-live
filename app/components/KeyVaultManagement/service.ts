import { PROCESSES } from './constants';
import InstallProcess from '../../backend/proccess-manager/install.process';
import RebootProcess from '../../backend/proccess-manager/reboot.process';
import ReinstallProcess from '../../backend/proccess-manager/reinstall.process';

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
