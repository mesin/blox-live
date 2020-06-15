#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

const aws = require('./lib/aws');
const server = require('./lib/server');

clear();

console.log(
  chalk.yellow(
    figlet.textSync('Blox Infra', { horizontalLayout: 'full' })
  )
);

const run = async () => {
  try {
    console.log(chalk.blue('+ Authentication'));
    await aws.getAccessKey();
    console.log(chalk.blue('+ Environment'));
    await aws.setup();
    // console.log(chalk.blue('+ Server setup'));
    // await server.setupEnv();
    console.log(chalk.green('+ Completed!'));
  } catch(err) {
    console.log(chalk.red(err.message));
  }
};

run();