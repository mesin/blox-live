#!/usr/bin/env node
import Configstore from 'configstore';
import chalk from 'chalk';

import AWSLib from './lib/aws';
import ServerLib from './lib/server';
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
  
  const conf = new Configstore('blox-infra');
  const aws = new AWSLib();
  const server = new ServerLib();
  const inquirer = new InquirerLib();
  const { version } = require('../package.json');

  console.log(chalk.blue.underline.bold(`version ${version}`));
  const argv = require('minimist')(process.argv.slice(2));
  const uninstall = argv._.includes('uninstall');
  if (uninstall) {
    try {
      console.log(chalk.blue('- Account organization'));
      await server.uninstall();
      console.log(chalk.blue('- Environment'));
      await aws.uninstall();
      console.log(chalk.blue('- Clean local storage'));
      conf.all = {};
      console.log(chalk.blue('- Uninstallation done!'));
    } catch(err) {
      console.log(chalk.red(err.message));
    }
  } else {
    if (argv.otp) {
      conf.set('otp', argv.otp);
    } else {
      const { otp } = await inquirer.askOtp();
      conf.set('otp', otp);  
    }
    try {
      console.log(chalk.blue('+ Setup server'));
      await aws.install();
      console.log(chalk.blue('+ Install vault plugin'));
      await server.install();
      console.log(chalk.green('+ Congratulations. Setup is done!'));
      console.log(chalk.blue(`> Open in your browser http://${conf.get('publicIp')}:8200 and setup Vault.`));
    } catch(err) {
      console.log(chalk.red(err.message));
    }
  }
  process.exit();
};

run();