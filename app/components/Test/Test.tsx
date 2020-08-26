import React, { useState } from 'react';

import { storeService } from '../../backend/store-manager/store.service';
import InstallProcess from '../../backend/proccess-manager/install.process';
import ReinstallProcess from '../../backend/proccess-manager/reinstall.process';
import UninstallProcess from '../../backend/proccess-manager/uninstall.process';
import RebootProcess from '../../backend/proccess-manager/reboot.process';
import { Observer } from '../../backend/proccess-manager/observer.interface';
import { Subject } from '../../backend/proccess-manager/subject.interface';
import AccountCreateProcess from '../../backend/proccess-manager/account-create.process';
import CleanStorageProcess from '../../backend/proccess-manager/clean-storage.process';
import SeedService from '../../backend/key-vault/seed.service';
import AccountKeyVaultService from '../../backend/account/account-key-vault.service';
import KeyVaultService from '../../backend/key-vault/key-vault.service';
import AccountService from '../../backend/account/account.service';
// import LoggerService from '../../backend/logger/logger.service';

class Listener implements Observer {
  private readonly logFunc: any;
  // private readonly logger: LoggerService;

  constructor(func: any) {
    this.logFunc = func;
    // this.logger = new LoggerService();
  }

  public update(subject: Subject, payload: any) {
    this.logFunc(`${subject.state}/${subject.actions.length} > ${payload.step.name}`);
    console.log(`${subject.state}/${subject.actions.length}`, payload);
    // this.logger.error(`${subject.state}/${subject.actions.length}`, payload);
  }
}

let configIsSet = false;
const Test = () => {
  // const logger = new LoggerService();
  // logger.debug('token', token);
  const seedService = new SeedService();
  const accountKeyVaultService = new AccountKeyVaultService();
  const accountService = new AccountService();
  const keyVaultService = new KeyVaultService();
  let [accessKeyId, setAccessKeyId] = useState('');
  let [mnemonic, setMnemonic] = useState('');
  let [publicKey, setPublicKey] = useState('');
  let [secretAccessKey, setSecretAccessKey] = useState('');
  let [processStatus, setProcessStatus] = useState('');

  if (!configIsSet) {
    configIsSet = true;
    if (storeService.get('credentials')) {
      const credentials: any = storeService.get('credentials');
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
            storeService.clear();
            accessKeyId = '';
            secretAccessKey = '';
            mnemonic = '';
            setAccessKeyId('');
            setSecretAccessKey('');
            setMnemonic('');
          }}
        >
          Clean config
        </button>
        <h3>Step 2. Install server & key-vault</h3>
        <input type={'text'} value={accessKeyId} onChange={(event) => setAccessKeyId(event.target.value)}
               placeholder="Access Key"/>
        <br/>
        <input type={'text'} value={secretAccessKey} onChange={(event) => setSecretAccessKey(event.target.value)}
               placeholder="Access Key Secret"/>
        <br/>
        <button
          onClick={async () => { // TODO: check this func
            const installProcess = new InstallProcess({ accessKeyId, secretAccessKey });
            const listener = new Listener(setProcessStatus);
            installProcess.subscribe(listener);
            try {
              await installProcess.run();
            } catch (e) {
              setProcessStatus(e);
            }
            console.log('+ Congratulations. Installation is done!');
            // logger.debug('+ Congratulations. Installation is done!');
          }}
        >
          Install
        </button>
        <h3>Step 3. Save mnemonic phrase</h3>
        <input type={'text'} value={mnemonic} onChange={(event) => setMnemonic(event.target.value)}
          placeholder="Mnemonic phrase" />
        <button onClick={async () => {
          await seedService.storeMnemonic(mnemonic, '');
        }}>
          Set mnemonic phrase
        </button>
        <h3>Step 4. Account create</h3>
        <button
          onClick={async () => {
            const accountCreateProcess = new AccountCreateProcess();
            const listener = new Listener(setProcessStatus);
            accountCreateProcess.subscribe(listener);
            try {
              await accountCreateProcess.run();
            } catch (e) {
              setProcessStatus(e);
            }
            console.log('+ Congratulations. Account Created');
            // logger.debug('+ Congratulations. Account Created');
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
            const listener = new Listener(setProcessStatus);
            const reinstallProcess = new ReinstallProcess();
            reinstallProcess.subscribe(listener);
            try {
              await reinstallProcess.run();
            } catch (e) {
              setProcessStatus(e);
            }
            console.log('+ Congratulations. Re-installation is done!');
          }}
        >
          Reinstall
        </button>
        <button
          onClick={async () => {
            const uninstallProcess = new UninstallProcess();
            const listener = new Listener(setProcessStatus);
            uninstallProcess.subscribe(listener);
            try {
              await uninstallProcess.run();
              accessKeyId = '';
              secretAccessKey = '';
              mnemonic = '';
              setAccessKeyId('');
              setSecretAccessKey('');
              setMnemonic('');
            } catch (e) {
              setProcessStatus(e);
            }
            console.log('+ Uninstallation is done!');
            // logger.debug('+ Uninstallation is done!');
          }}
        >
          Uninstall
        </button>
        <button
          onClick={async () => {
            const rebootProcess = new RebootProcess();
            const listener = new Listener(setProcessStatus);
            rebootProcess.subscribe(listener);
            try {
              await rebootProcess.run();
            } catch (e) {
              setProcessStatus(e);
            }
            console.log('+ Congratulations. Reboot is done!');
            // logger.debug('+ Congratulations. Reboot is done!');
          }}
        >
          Reboot
        </button>
        <button
          onClick={async () => {
            const cleanStorageProcess = new CleanStorageProcess();
            const listener = new Listener(setProcessStatus);
            cleanStorageProcess.subscribe(listener);
            try {
              await cleanStorageProcess.run();
            } catch (e) {
              setProcessStatus(e);
            }
            console.log('+Clean Accounts from storage is done!');
            // logger.debug('+Clean Accounts from storage is done!');
          }}
        >
          Clean Accounts from Storage
        </button>
      </div>
      <p/>
      <h2>Local Storage Only</h2>
      <div>
        <button onClick={async () => {
          await seedService.mnemonicGenerate();
        }}>
          Generate Mnemonic
        </button>
        <button onClick={async () => {
          await accountKeyVaultService.createWallet();
        }}>
          Create Wallet
        </button>
        <button onClick={async () => {
          await accountKeyVaultService.createAccount();
        }}>
          Create Account
        </button>
        <button onClick={async () => {
          await accountKeyVaultService.listAccounts();
        }}>
          List Accounts
        </button>
        <button onClick={async () => {
          await accountKeyVaultService.getLastIndexedAccount();
        }}>
          Get Last Indexed Account
        </button>
        <button onClick={async () => {
          await accountKeyVaultService.deleteLastIndexedAccount();
        }}>
          Delete Last Indexed Account
        </button>
        <br/>
        <input type={'text'} value={publicKey} onChange={(event) => setPublicKey(event.target.value)} placeholder="Public key"/>
        <button onClick={async () => {
          await accountKeyVaultService.getDepositData(publicKey);
        }}>
          Get Account Deposit Data
        </button>
      </div>
      <p/>
      <h2>Blox API</h2>
      <div>
        <button onClick={async () => {
          console.log(await accountService.get());
        }}>
          Get Accounts
        </button>
        <button onClick={async () => {
          console.log(await accountService.getLatestTag());
        }}>
          Get Latest Tag
        </button>
      </div>
      <p/>
      <h2>Vault Plugin API</h2>
      <div>
        <button onClick={async () => {
          console.log(JSON.parse(await keyVaultService.healthCheck()));
        }}>
          Status
        </button>
        <button onClick={async () => {
          console.log(JSON.parse(await keyVaultService.listAccounts()));
        }}>
          List Accounts
        </button>
      </div>
      <p/>
      <textarea value={processStatus} cols={100} rows={10}></textarea>
    </div>
  );
};

export default Test;
