import Configstore from 'configstore';
const Steps = require('cli-step');

export default class FlowLib {
  public conf: Configstore;

  constructor(storeName: string) {
    this.conf = new Configstore(storeName);
  }

  validate(itemName: string): void {
    if (!this.conf.get(itemName)) {
      throw new Error(`${itemName} not found.`);
    }
  }

  async delay(ms = 5000): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, ms));
  }

  async run(instance: any, flowSteps: Array<any>, scopeKey?: string): Promise<void> {
    const firstStep = this.conf.get(`${scopeKey}.currentStep`) || 0;
    const totalSteps = flowSteps.filter((st, index) => st.name && index >= firstStep).length;
    if (!totalSteps) return;
    const steps = new Steps(totalSteps);
    for (let i = firstStep; i < flowSteps.length; i++) {
      scopeKey && this.conf.set(`${scopeKey}.currentStep`, i);
      const step = flowSteps[i];
      let stepInfo = step.name && steps.advance(step.name, 'hammer_and_wrench', '').start();
      try {
        await step.func.bind(instance)();
        step.name && stepInfo.success(step.name, 'white_check_mark');
      } catch (error) {
        step.name && stepInfo.error(step.name);
        throw new Error(error.message);
      }
    }
  }
}
