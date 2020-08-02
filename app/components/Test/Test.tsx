import React, {useState} from 'react';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { getIdToken } from '../CallbackPage/selectors';

import Configstore from 'configstore';
import InstallProcess from '../../backend/proccess-manager/install.process';
import ReinstallProcess from '../../backend/proccess-manager/reinstall.process';
import UninstallProcess from '../../backend/proccess-manager/uninstall.process';
import RebootProcess from '../../backend/proccess-manager/reboot.process';
import AccountRemoveProcess from '../../backend/proccess-manager/account-remove.process';
import { Observer } from '../../backend/proccess-manager/observer.interface';
import { Subject } from '../../backend/proccess-manager/subject.interface';
import AccountCreateProcess from '../../backend/proccess-manager/account-create.process';

class Listener implements Observer {
  private logFunc: any;
  constructor(func: any) {
    this.logFunc = func;
  }

  public update(subject: Subject, payload: any) {
    this.logFunc(`${subject.state}/${subject.actions.length} > ${payload.step.name}`);
    console.log(`${subject.state}/${subject.actions.length}`, payload);
  }
}

const setClientStorageParams = (storeName: string, params: any) => {
  const conf = new Configstore(storeName);
  Object.keys(params).forEach((key) => {
    conf.set(key, params[key]);
  });
};

let configIsSet = false;

const Test = (props) => {
  // const { token } = props;
  const token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InJwclpfdXBQUFpSV1VLOHNjVU1qbiJ9.eyJnaXZlbl9uYW1lIjoiVmFkaW0iLCJmYW1pbHlfbmFtZSI6IkNpdW1hYyIsIm5pY2tuYW1lIjoidmFkaW0iLCJuYW1lIjoiVmFkaW0gQ2l1bWFjIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS8taE1ZeGxPbVk1bEUvQUFBQUFBQUFBQUkvQUFBQUFBQUFBQUEvQU1adXVjbnRQVy1wNFlYRktXQjB2WXUtN2tteUhMSzI0dy9waG90by5qcGciLCJsb2NhbGUiOiJlbiIsInVwZGF0ZWRfYXQiOiIyMDIwLTA4LTAyVDEyOjQxOjM2LjcwNFoiLCJlbWFpbCI6InZhZGltQGJsb3guaW8iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6Ly9ibG94LWluZnJhLmV1LmF1dGgwLmNvbS8iLCJzdWIiOiJnb29nbGUtb2F1dGgyfDExNTc3OTk5NTkxNTE2MzA1OTg5NCIsImF1ZCI6Imp6UHY2akhVcHY3eFFmbWtOcUw4YklUcGx6dkk1QmliIiwiaWF0IjoxNTk2MzcyMDk2LCJleHAiOjE1OTY0MDgwOTYsImF0X2hhc2giOiJ4VGZaX1JTT1RiYkNFcFZRdF92MUZBIiwibm9uY2UiOiJRNGRQd2prSHpONHZHdDlEUTIxUk1uX3BRc0I5ME9YeiJ9.UkgtjW9u482cyBgxJJLmdb9SUr6Jkfs_Eaq36ijiz07BZbLenzXxqGnXt59NuoIu8WdYXTNCEAMO5zFlI9Z5WdfGxIwwUHwPlX1YgHvDrbjjB4wTYQueWgkhOtUkAP9hjsh62-SetOzriJ7lXrted1Xbi0_IT4obIjc2PnOKV8qSlJQuwaYrrO3dCTl7VSUXaMDEgPFtkjQnz9OTB2xOUsnl1072Jc0auKt40embR1STeXfYRfR9rrjwe4gIDtY_NqVnmiK82Hkwcz-LdUesV-y1qGdkwA_6V9V5nWBNZWlTctdMdEhbiJFfxpa32zx2XoQOB9PrZixCWIKs29mCdw';
  console.log('token', token);

  let [accessKeyId, setAccessKeyId] = useState('');
  let [secretAccessKey, setSecretAccessKey] = useState('');
  let [processStatus, setProcessStatus] = useState('');
  if (!configIsSet) {
    configIsSet = true;
    const generalConf = new Configstore('blox');
    generalConf.set('authToken', token);
    if (generalConf.get('credentials')) {
      setAccessKeyId(generalConf.get('credentials').accessKeyId);
      setSecretAccessKey(generalConf.get('credentials').secretAccessKey);
    }
  }
  return (
    <div>
      <h1>CLI commands</h1>
      <button
        onClick={async () => {
          const storeName = 'blox';
          const conf = new Configstore(storeName);
          console.log(conf.get('seed'));
          const accountCreateProcess = new AccountCreateProcess(storeName);
          const listener = new Listener(setProcessStatus);
          accountCreateProcess.subscribe(listener);
          try {
            await accountCreateProcess.run();
          } catch (e) {
            setProcessStatus(e);
          }
          console.log('+ Congratulations. Private Key Created');
        }}
      >
        Account Create
      </button>
      <button
        onClick={async () => {
          const mainStoreName = `blox`;
          const tmpStoreName = `blox-tmp`;
          const confMain = new Configstore(mainStoreName);

          setClientStorageParams(tmpStoreName, {
            uuid: confMain.get('uuid'),
            authToken: confMain.get('authToken'),
            credentials: confMain.get('credentials'),
            keyPair: confMain.get('keyPair'),
            securityGroupId: confMain.get('securityGroupId'),
            keyVaultStorage: confMain.get('keyVaultStorage')
          });

          const listener = new Listener(setProcessStatus);
          const reinstallProcess = new ReinstallProcess(tmpStoreName);
          reinstallProcess.subscribe(listener);
          try {
            await reinstallProcess.run();
          } catch (e) {
            setProcessStatus(e);
          }
          const confTmpStore = new Configstore(tmpStoreName);
          setClientStorageParams(confMain, {
            uuid: confTmpStore.get('uuid'),
            authToken: confTmpStore.get('authToken'),
            addressId: confTmpStore.get('addressId'),
            publicIp: confTmpStore.get('publicIp'),
            instanceId: confTmpStore.get('instanceId'),
            vaultRootToken: confTmpStore.get('vaultRootToken'),
            keyVaultVersion: confTmpStore.get('keyVaultVersion'),
            keyVaultStorage: confTmpStore.get('keyVaultStorage')
          });
          confTmpStore.clear();

          console.log('+ Congratulations. Reinstallation is done!');
        }}
      >
        Reinstall
      </button>
      <button
        onClick={async () => {
          const storeName = 'blox';
          const uninstallProcess = new UninstallProcess(storeName);
          const accountRemoveProcess = new AccountRemoveProcess(storeName);
          const listener = new Listener(setProcessStatus);
          uninstallProcess.subscribe(listener);
          accountRemoveProcess.subscribe(listener);
          try {
            await accountRemoveProcess.run();
            await uninstallProcess.run();
          } catch (e) {
            setProcessStatus(e);
          }
          console.log('+ Uninstallation is done!');
        }}
      >
        Uninstall
      </button>
      <button
        onClick={async () => {
          const storeName = 'blox';
          const rebootProcess = new RebootProcess(storeName);
          const listener = new Listener(setProcessStatus);
          rebootProcess.subscribe(listener);
          try {
            await rebootProcess.run();
          } catch (e) {
            setProcessStatus(e);
          }
          console.log('+ Congratulations. Reboot is done!');
        }}
      >
      Reboot
      </button>
      <p/>
      <br/>
      <input type={'text'} value={accessKeyId} onChange={(event) => setAccessKeyId(event.target.value)} placeholder="Access Key" />
      <br/>
      <input type={'text'} value={secretAccessKey} onChange={(event) => setSecretAccessKey(event.target.value)} placeholder="Access Key Secret" />
      <br/>
      <button
        onClick={async () => { // TODO: check this func
          const storeName = 'blox';
          const conf = new Configstore(storeName);
          if (!conf.get('uuid')) {
            conf.set('uuid', uuidv4());
          }
          conf.set('credentials', {
            accessKeyId,
            secretAccessKey,
          });
          const installProcess = new InstallProcess(storeName);
          const listener = new Listener(setProcessStatus);
          installProcess.subscribe(listener);
          try {
            await installProcess.run();
          } catch (e) {
            setProcessStatus(e);
          }
          console.log('+ Congratulations. Installation is done!');
        }}
      >
        Install
      </button>
      <button
        onClick={async () => {
          const storeName = 'blox';
          const conf = new Configstore(storeName);
          conf.clear();
          accessKeyId = '';
          secretAccessKey = '';
          setAccessKeyId('');
          setSecretAccessKey('');
        }}
      >
        Clean config
      </button>
      <p/>
      <textarea value={processStatus} cols={100} rows={10}></textarea>
    </div>
  );
};

const mapStateToProps = (state) => ({
  token: getIdToken(state),
});

export default connect(mapStateToProps)(Test);
