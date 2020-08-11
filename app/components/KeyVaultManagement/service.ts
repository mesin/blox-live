import { PROCESSES } from './constants';
import InstallProcess from '../../backend/proccess-manager/install.process';
import RebootProcess from '../../backend/proccess-manager/reboot.process';
import ReinstallProcess from '../../backend/proccess-manager/reinstall.process';

export const processInstantiator = (processName: string, payload) => {
  const { accessKeyId, secretAccessKey, authToken } = payload;
  if (processName === PROCESSES.INSTALL) {
    return new InstallProcess({accessKeyId, secretAccessKey, authToken});
  }
  if (processName === PROCESSES.RESTART) {
    return new RebootProcess();
  }
  if (processName === PROCESSES.REINSTALL) {
    return new ReinstallProcess();
  }
  return null;
};
