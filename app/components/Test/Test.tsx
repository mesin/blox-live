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
import RestoreProcess from '../../backend/proccess-manager/restore.process';

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
  let [accessKeyId, setAccessKeyId] = useState('');
  let [mnemonic, setMnemonic] = useState('');
  let [secretAccessKey, setSecretAccessKey] = useState('');
  let [processStatus, setProcessStatus] = useState('');
  let token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InJwclpfdXBQUFpSV1VLOHNjVU1qbiJ9.eyJnaXZlbl9uYW1lIjoiVmFkaW0iLCJmYW1pbHlfbmFtZSI6IkNpdW1hYyIsIm5pY2tuYW1lIjoidmFkaW0iLCJuYW1lIjoiVmFkaW0gQ2l1bWFjIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS8taE1ZeGxPbVk1bEUvQUFBQUFBQUFBQUkvQUFBQUFBQUFBQUEvQU1adXVjbnRQVy1wNFlYRktXQjB2WXUtN2tteUhMSzI0dy9waG90by5qcGciLCJsb2NhbGUiOiJlbiIsInVwZGF0ZWRfYXQiOiIyMDIwLTA4LTA0VDA2OjEwOjM5LjAxNFoiLCJlbWFpbCI6InZhZGltQGJsb3guaW8iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6Ly9ibG94LWluZnJhLmV1LmF1dGgwLmNvbS8iLCJzdWIiOiJnb29nbGUtb2F1dGgyfDExNTc3OTk5NTkxNTE2MzA1OTg5NCIsImF1ZCI6Imp6UHY2akhVcHY3eFFmbWtOcUw4YklUcGx6dkk1QmliIiwiaWF0IjoxNTk2NTIxNDM5LCJleHAiOjE1OTY1NTc0MzksImF0X2hhc2giOiJ0NjdqWVg0MU1TMlJyZ3otalltbER3Iiwibm9uY2UiOiIuWHVSckZhR0hUQkl4S3Q2NU9mTkpTVjMydDJLSnFOMiJ9.h8kRolB_fyahfN6crE9CCFWkWiKlxXVDA1CK4AVpyb9RGFVvWrzsVC3xZuAnFAy4uAu38MUMIu4T4-K9UcHJ0DC926oDsQca8B9Wg1ie7uFO7Ktj-k6tS-0a6jVmX76ejn2HY_LdJWiwrsV8QXvAA49m4xgZbggOzHjqfRiRrw_9qqBd7UgA3-yRrc-LXCoLsjn6n9k_LUPdkf1R-AE6OS8jMit8C6_bi64PbFRfEMW0VjitGVeYZKzjzO6VVc1pNvJ858_F4zXfJm73DNcTIX_Obzkjsm_wWFJrosbCFpKbWhwB0N5bEn7SUdDrIokO8YQcoXfcq2PD1j7qOf9VWQ';
  console.log('token', token);
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
      <div>
        <h2>Restore Process</h2>
        <h3>Step 1. Clean storage</h3>
        <button
          onClick={async () => {
            const storeName = 'blox';
            const conf = new Configstore(storeName);
            conf.clear();
            accessKeyId = '';
            secretAccessKey = '';
            setAccessKeyId('');
            setSecretAccessKey('');
            conf.set('authToken', token);
          }}
        >
          Clean config
        </button>
        <h3>Step 2. Install server & key-vault</h3>
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
        <h3>Step 3. Save mnemonic phrase</h3>
        <input type={'text'} value={mnemonic} onChange={(event) => setMnemonic(event.target.value)} placeholder="Mnemonic phrase" />
        <button
          onClick={async () => {
            const storeName = 'blox';
            const conf = new Configstore(storeName);
            conf.set('mnemonic', mnemonic);
            if (conf.get('seed')) {
              console.log('Seed already exists');
              return;
            }
            const restoreProcess = new RestoreProcess(storeName);
            const listener = new Listener(setProcessStatus);
            restoreProcess.subscribe(listener);
            try {
              await restoreProcess.run();
            } catch (e) {
              setProcessStatus(e);
            }
            console.log('+ Congratulations. Seed was saved');
          }}
        >
          Set mnemonic phrase
        </button>
        <h3>Step 4. Account create</h3>
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
            console.log('+ Congratulations. Account Created');
          }}
        >
          Account Create
        </button>
      </div>
      <p/>
      <div>
        <h2>Other</h2>
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
              console.log('try')
              await accountRemoveProcess.run();
              // await uninstallProcess.run();
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
      </div>
      <p/>
      <textarea value={processStatus} cols={100} rows={10}></textarea>
    </div>
  );
};

const mapStateToProps = (state) => ({
  token: getIdToken(state),
});

export default connect(mapStateToProps)(Test);
