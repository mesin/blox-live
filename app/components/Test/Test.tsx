import React from 'react';
import Configstore from 'configstore';
import InstallService from '../../backend/proccess-manager/install.service';
import KeyVaultCli from '../../backend/key-vault/seed.service'
import { Observer } from '../../backend/proccess-manager/observer.interface';
import { Subject } from '../../backend/proccess-manager/subject.interface';

class Listener implements Observer {
  public update(subject: Subject, payload: any) {
    console.log(payload.msg);
  }
}

const Test = () => {
  const storeName = 'blox';
  const conf = new Configstore(storeName);
  conf.set('otp', 'test-otp');
  conf.set('credentials', {
    accessKeyId: 'test',
    secretAccessKey: 'test',
  });
  const installService = new InstallService(storeName);
  const keyVaultCliService = new KeyVaultCli();
  return (
    <div>
      <h1>CLI commands</h1>
      <div>
        <h2>KeyVault Management</h2>
        <button
          onClick={async () => {
            console.log('test');
            const listener = new Listener();
            installService.subscribe(listener);
            await installService.run();
          }}
        >
          Install
        </button>
        <button onClick={() => console.log('test')}>Uninstall</button>
        <button onClick={() => console.log('test')}>Reinstall</button>
        <button onClick={() => console.log('test')}>Reboot</button>
      </div>
      <div>
        <h2>Seed Management</h2>
        <button onClick={async () => { await keyVaultCliService.seedGenerate()}}>Seed</button>
        <button onClick={async () => { await keyVaultCliService.mnemonicGenerate()}}>Mnemonic</button>
        <button onClick={async () => { await keyVaultCliService.seedToMnemonicGenerate()}}>Seed to Mnemonic</button>
      </div>
    </div>
  );
};

export default Test;
