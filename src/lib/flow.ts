import Configstore from 'configstore';
const Steps = require('cli-step');

export default class FlowLib {
  public conf: Configstore = new Configstore('blox-infra');

  validate(itemName: string): void {
    if (!this.conf.get(itemName)) {
      throw new Error(`${itemName} not found.`);
    }
  }

  async delay(ms = 5000): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, ms));
  }

  async run(flowSteps: Array<any>): Promise<void> {
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
}
