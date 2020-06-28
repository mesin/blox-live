#!/usr/bin/env node
const CLI = require('clui');
const Configstore = require('configstore');

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

const aws = require('./lib/aws');
const server = require('./lib/server');
const inquirer = require('./lib/inquirer');

const Spinner = CLI.Spinner;
const { version, name } = require('./package.json');

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
      await aws.uninstall();
      conf.all = {};
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
      console.log(chalk.blue('+ Authentication'));
      await aws.getAccessKey();
      const instanceId = conf.get('instanceId');
      if (!instanceId) {
        console.log(chalk.blue('+ Environment'));
        await aws.setup();
      }
      console.log(chalk.blue('+ Server setup'));
      const status = new Spinner('Waiting for ready to use instance. It might take up to 3min...');
      status.start();
      // await aws.waitForInstanceRunning();
      await server.delay(60000); // test for 1 minute wait time
      status.stop();
      await server.setupEnv();
      const publicIp = conf.get('publicIp');
      console.log(chalk.green('+ Congratulations. Setup is done!'));
      console.log(chalk.blue(`> Open in your browser http://${publicIp}:8200 and setup Vault.`));
    } catch(err) {
      console.log(chalk.red(err.message));
    }
  }

  process.exit();
};

run();