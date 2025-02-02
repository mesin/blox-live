import { PROCESSES } from './constants';
import InstallProcess from '../../backend/proccess-manager/install.process';
import RecoveryProcess from '../../backend/proccess-manager/recovery.process';
import RebootProcess from '../../backend/proccess-manager/reboot.process';
import ReinstallProcess from '../../backend/proccess-manager/reinstall.process';
import SendImagesProcess from '../../backend/proccess-manager/send-images.process';
import AccountCreateProcess from '../../backend/proccess-manager/account-create.process';

import { Observer } from '../../backend/proccess-manager/observer.interface';
import { Subject } from '../../backend/proccess-manager/subject.interface';

export const processInstantiator = (processName: string, payload: Record<string, any> | undefined) => {
  if (processName === PROCESSES.INSTALL && payload.credentials) {
    const { accessKeyId, secretAccessKey } = payload.credentials;
    return new InstallProcess({accessKeyId, secretAccessKey});
  }
  if (processName === PROCESSES.RECOVERY && payload.credentials) {
    const { accessKeyId, secretAccessKey } = payload.credentials;
    return new RecoveryProcess({accessKeyId, secretAccessKey, isNew: false});
  }
  if (processName === PROCESSES.RESTART) {
    return new RebootProcess();
  }
  if (processName === PROCESSES.REINSTALL) {
    return new ReinstallProcess();
  }
  if (processName === PROCESSES.SEND_IMAGES) {
    return new SendImagesProcess(payload.images);
  }
  if (processName === PROCESSES.SHOW_IMAGES) {
    // TODO: return new ShowImagesProcess();
  }
  if (processName === PROCESSES.CREATE_ACCOUNT && payload.network) {
    return new AccountCreateProcess(payload.network);
  }
  return null;
};

export class Listener implements Observer {
  private logFunc: any;
  constructor(func: any) {
    this.logFunc = func;
  }
  public update(subject: Subject, payload: any) {
    this.logFunc(subject, payload);
  }
}
