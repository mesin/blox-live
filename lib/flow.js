const Steps = require('cli-step');
const conf = new Configstore('blox-infra');

async function validate(itemName) {
  if (!conf.get(itemName)) {
    throw new Error(`${itemName} not found.`);
  }
}


const delay = async (ms = 5000) => await new Promise(resolve => setTimeout(resolve, ms));

async function run(flowSteps) {
  const steps = new Steps(flowSteps.length);
  for (const step of flowSteps) {
    const stepInfo = steps.advance(step.name, 'hammer_and_wrench', '').start();
    try {
      await step.func();
      stepInfo.success(step.name, 'white_check_mark');
    } catch (error) {
      stepInfo.error(step.name);
      throw new Error(error.message);
    }
  }
}


module.exports = {
  delay,
  run,
  validate
};
