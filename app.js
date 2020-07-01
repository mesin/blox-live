#!/usr/bin/env node
const Configstore = require('configstore');

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

const aws = require('./lib/aws');
const server = require('./lib/server');
const inquirer = require('./lib/inquirer');

const { version } = require('./package.json');

clear();

console.log(
  chalk.yellow(
    figlet.textSync('Blox Staking', { horizontalLayout: 'full' })
  )
);

const run = async () => {
  console.log(chalk.blue.underline.bold(`version ${version}`));
  const conf = new Configstore('blox-infra');
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