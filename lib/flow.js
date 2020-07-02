const Steps = require('cli-step');
const Configstore = require('configstore');
const conf = new Configstore('blox-infra');

function validate(itemName) {
  if (!conf.get(itemName)) {
    throw new Error(`${itemName} not found.`);
  }
}

const delay = async (ms = 5000) => await new Promise(resolve => setTimeout(resolve, ms));

async function run(flowSteps) {
  const steps = new Steps(flowSteps.filter(st => st.name).length);
  for (const step of flowSteps) {
    let stepInfo;
    if (step.name) stepInfo = steps.advance(step.name, 'hammer_and_wrench', '').start();
    try {
      await step.func();
      step.name && stepInfo.success(step.name, 'white_check_mark');
    } catch (error) {
      step.name && stepInfo.error(step.name);
      throw new Error(error.message);
    }
  }
}


module.exports = {
  delay,
  run,
  validate
};
