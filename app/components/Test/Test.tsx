import React, {useState} from 'react';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { getIdToken } from '../CallbackPage/selectors';

import ElectronStore from 'electron-store';
import InstallProcess from '../../backend/proccess-manager/install.process';
import ReinstallProcess from '../../backend/proccess-manager/reinstall.process';
import UninstallProcess from '../../backend/proccess-manager/uninstall.process';
import RebootProcess from '../../backend/proccess-manager/reboot.process';
import AccountRemoveProcess from '../../backend/proccess-manager/account-remove.process';
import { Observer } from '../../backend/proccess-manager/observer.interface';
import { Subject } from '../../backend/proccess-manager/subject.interface';
import AccountCreateProcess from '../../backend/proccess-manager/account-create.process';
import RestoreProcess from '../../backend/proccess-manager/restore.process';
import CleanStorageProcess from '../../backend/proccess-manager/clean-storage.process';
import SeedService from '../../backend/key-vault/seed.service'

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
  const conf = new ElectronStore({ name: storeName });
  Object.keys(params).forEach((key) => {
    params[key] && conf.set(key, params[key]);
  });
};

let configIsSet = false;

const Test = (props) => {
  const { token } = props;
  const seedService = new SeedService('blox');

  let [accessKeyId, setAccessKeyId] = useState('');
  let [mnemonic, setMnemonic] = useState('');
  let [secretAccessKey, setSecretAccessKey] = useState('');
  let [processStatus, setProcessStatus] = useState('');

  if (!configIsSet) {
    configIsSet = true;
    const generalConf = new ElectronStore({ name: 'blox' });
    generalConf.set('authToken', token);
    if (generalConf.get('credentials')) {
      const credentials : any = generalConf.get('credentials');
      setAccessKeyId(credentials.accessKeyId);
      setSecretAccessKey(credentials.secretAccessKey);
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
            const conf = new ElectronStore({ name: storeName });
            conf.clear();
            accessKeyId = '';
            secretAccessKey = '';
            mnemonic = '';
            setAccessKeyId('');
            setSecretAccessKey('');
            setMnemonic('');
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
            const conf = new ElectronStore({ name: storeName });
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
            const conf = new ElectronStore({ name: storeName });
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
            const conf = new ElectronStore({ name: storeName });
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
            const confMain = new ElectronStore({ name: mainStoreName });

            setClientStorageParams(tmpStoreName, {
              uuid: confMain.get('uuid'),
              authToken: confMain.get('authToken'),
              credentials: confMain.get('credentials'),
              keyPair: confMain.get('keyPair'),
              securityGroupId: confMain.get('securityGroupId'),
              keyVaultStorage: confMain.get('keyVaultStorage'),
            });

            const listener = new Listener(setProcessStatus);
            const reinstallProcess = new ReinstallProcess(tmpStoreName);
            const uninstallProcess = new UninstallProcess(mainStoreName);
            reinstallProcess.subscribe(listener);
            uninstallProcess.subscribe(listener);
            try {
              await reinstallProcess.run();
              await uninstallProcess.run();
            } catch (e) {
              setProcessStatus(e);
            }
            const confTmpStore = new ElectronStore({ name: tmpStoreName });
            console.log('confTmpStore====', confTmpStore);
            setClientStorageParams(mainStoreName, {
              uuid: confTmpStore.get('uuid'),
              authToken: confTmpStore.get('authToken'),
              addressId: confTmpStore.get('addressId'),
              publicIp: confTmpStore.get('publicIp'),
              instanceId: confTmpStore.get('instanceId'),
              vaultRootToken: confTmpStore.get('vaultRootToken'),
              keyVaultVersion: confTmpStore.get('keyVaultVersion'),
              keyVaultStorage: confTmpStore.get('keyVaultStorage'),
            });
            confTmpStore.clear();
            const testmain = new ElectronStore({ name: mainStoreName });
            console.log('confTmpStore====', testmain);
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
              const conf = new ElectronStore({ name: storeName });
              conf.clear();
              accessKeyId = '';
              secretAccessKey = '';
              mnemonic = '';
              setAccessKeyId('');
              setSecretAccessKey('');
              setMnemonic('');
              conf.set('authToken', token);
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
        <button
          onClick={async () => {
            const storeName = 'blox';
            const cleanStorageProcess = new CleanStorageProcess(storeName);
            const listener = new Listener(setProcessStatus);
            cleanStorageProcess.subscribe(listener);
            try {
              await cleanStorageProcess.run();
            } catch (e) {
              setProcessStatus(e);
            }
            console.log('+Clean Accounts from storage is done!');
          }}
        >
          Clean Accounts from Storage
        </button>
        <button onClick={async () => { await seedService.mnemonicGenerate()}}>Generate Mnemonic</button>
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
