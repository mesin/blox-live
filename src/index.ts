#!/usr/bin/env node
import { Command } from 'commander';
import Configstore from 'configstore';
import chalk from 'chalk';

import AWSLib from './lib/aws';
import KeyVaultLib from './lib/key-vault';
import InquirerLib from './lib/inquirer';

const clear = require('clear');
const figlet = require('figlet');

const run = async () => {
  clear();
  console.log(
    chalk.yellow(
      figlet.textSync('Blox Staking', { horizontalLayout: 'full' })
    )
  );
  const conf = new Configstore('blox-general');
  const { version } = require('../package.json');
  console.log(chalk.blue.underline.bold(`version ${version}`));

  const inquirer = new InquirerLib();
  const program = new Command();
  program
    .version(version)
    .name('blox-live');

  program
    .command('install')
    .description('run install process')
    .option("--otp [otp]", "generated OTP for installation")
    .action(async(options) => {
      if (!conf.get('otp')) {
        if (options.otp) {
          conf.set('otp', options.otp);
        } else {
          const { otp } = await inquirer.askOtp();
          conf.set('otp', otp);  
        }  
      }
      const storeName = `blox-${conf.get('otp')}`;
      setClientStorageParams(storeName, { otp: conf.get('otp') });
      const aws = new AWSLib(storeName);
      const keyVault = new KeyVaultLib(storeName);
      const confClient = new Configstore(storeName);
    
      try {
        console.log(chalk.blue('+ Setup server'));
        !conf.get('install.aws.done') && await aws.install();
  
        console.log(chalk.blue('+ Install Key Vault'));
        !conf.get('install.keyVault.done') && await keyVault.install();
  
        console.log(chalk.green('+ Congratulations. Setup is done!'));
        console.log(chalk.blue(`> Open in your browser http://${confClient.get('publicIp')}:8200 and setup Vault.`));
      } catch(err) {
        console.log(chalk.red(err.message));
      }
      process.exit();
    });

  program
    .command('uninstall')
    .description('run uninstall process')
    .action(async() => {
      if (!conf.get('otp')) throw new Error('installation results was not found');
      const storeName = `blox-${conf.get('otp')}`;
      const confClient = new Configstore(storeName);
      const aws = new AWSLib(storeName);
      const keyVault = new KeyVaultLib(storeName);
      try {
        console.log(chalk.blue('- Account organization'));
        !conf.get('uninstall.keyVault.done') && await keyVault.uninstall();
  
        console.log(chalk.blue('- Environment'));
        !conf.get('uninstall.aws.done') && await aws.uninstall();
  
        console.log(chalk.blue('- Clean local storage'));
        conf.clear();
        confClient.clear();
  
        console.log(chalk.blue('- Uninstallation done!'));
      } catch(err) {
        console.log(chalk.red(err.message));
      }
      process.exit();
    });

  program
    .command('reboot')
    .description('reboot instance')
    .action(async() => {
      if (!conf.get('otp')) throw new Error('installation results was not found');
      const aws = new AWSLib(`blox-${conf.get('otp')}`);
      try {
        await aws.reboot();
        console.log(chalk.blue('Server reboot requested!'));
      } catch(err) {
        console.log(chalk.red(err.message));
      }
      process.exit();
    });

  program
    .command('reinstall')
    .description('reinstall instance')
    .action(async() => {
      if (!conf.get('otp')) throw new Error('installation results was not found');
      const currentStoreName = `blox-${conf.get('otp')}`
      const confClient = new Configstore(currentStoreName);

      const tmpStoreName = `${currentStoreName}-tmp`;
      setClientStorageParams(tmpStoreName, {
        credentials: confClient.get('credentials'),
        otp: confClient.get('otp'),
        keyPair: confClient.get('keyPair'),
        securityGroupId: confClient.get('securityGroupId')
      });

      const aws = new AWSLib(tmpStoreName);
      const keyVault = new KeyVaultLib(tmpStoreName);
      const awsOld = new AWSLib(currentStoreName);
      const confClientTmp = new Configstore(tmpStoreName);
      try {
        console.log(chalk.blue('+ Setup new server'));
        !confClientTmp.get('reinstall.aws.done') && await aws.reinstall();

        console.log(chalk.blue('+ Install new key vault'));
        !confClientTmp.get('reinstall.keyVault.done') && await keyVault.reinstall();

        console.log(chalk.blue('- Truncate old server'));
        !confClient.get('reinstall.awsOld.done') && await awsOld.uninstallOldServer();
  
        setClientStorageParams(currentStoreName, {
          addressId: confClientTmp.get('addressId'),
          publicIp: confClientTmp.get('publicIp'),
          instanceId: confClientTmp.get('instanceId'),
          vaultRootToken: confClientTmp.get('vaultRootToken')
        });

        console.log(chalk.blue('- Clean tmp local storage'));
        confClientTmp.clear();
  
        console.log(chalk.blue('+ Reinstallation done!'));
        console.log(chalk.blue(`> New key vault server url: http://${confClient.get('publicIp')}:8200.`));
      } catch(err) {
        console.log(chalk.red(err.message));
      }
      process.exit();
    });

  program.parse(process.argv);
};

const setClientStorageParams = (storeName: string, params: any) => {
  const conf = new Configstore(storeName);
  Object.keys(params).forEach(key => {
    conf.set(key, params[key]);
  });
};

run();