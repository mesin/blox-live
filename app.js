#!/usr/bin/env node
const CLI = require('clui');
const Configstore = require('configstore');

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

const aws = require('./lib/aws');
const server = require('./lib/server');
const Spinner = CLI.Spinner;

clear();

console.log(
  chalk.yellow(
    figlet.textSync('Blox Staking', { horizontalLayout: 'full' })
  )
);

const run = async () => {
  try {
    console.log(chalk.blue('+ Authentication'));
    await aws.getAccessKey();
    const conf = new Configstore('blox-infra');
    const instanceId = conf.get('credentials');
    if (!instanceId) {
      console.log(chalk.blue('+ Environment'));
      await aws.setup();
    }
    console.log(chalk.blue('+ Server setup'));
    const status = new Spinner('Waiting for ready to use instance. It might take up to 3min...');
    status.start();
    await aws.waitForInstanceRunning();
    status.stop();
    await server.setupEnv();
    const publicIp = conf.get('publicIp');
    console.log(chalk.green('+ Congratulations. Setup is done!'));
    console.log(chalk.blue(`> Open in your browser http://${publicIp} and setup Vault.`));
  } catch(err) {
    console.log(chalk.red(err.message));
  }
  process.exit();
};

run();