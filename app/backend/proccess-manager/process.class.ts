import { Subject } from './subject.interface';
import { Observer } from './observer.interface';
import { Catch, catchDecoratorStore } from '../decorators/catch.decorator';
// import LoggerService from '../logger/logger.service';

export default class ProcessClass implements Subject {
  readonly actions: Array<any>;
  readonly fallbackActions: Array<any>;
  // private readonly logger: LoggerService;
  state: number;
  action: any;
  /**
   * @type {Observer[]} List of subscribers. In real life, the list of
   * subscribers can be stored more comprehensively (categorized by event
   * type, etc.).
   */
  observers: Observer[] = [];

  constructor() {
    // this.logger = new LoggerService();
    catchDecoratorStore.setHandler(error => this.errorHandler(error));
  }

  /**
   * The subscription management methods.
   */
  subscribe(observer: any): void { // Observer
    const isExist = this.observers.includes(observer);
    if (isExist) {
      return console.log('Subject: Observer has been attached already.');
      // return this.logger.debug('Subject: Observer has been attached already.');
    }
    console.log('Subject: Attached an observer.');
    // this.logger.debug('Subject: Attached an observer.');
    this.observers.push(observer);
  }

  unsubscribe(observer: any): void { // Observer
    const observerIndex = this.observers.indexOf(observer);
    if (observerIndex === -1) {
      return console.log('Subject: Nonexistent observer.');
      // return this.logger.debug('Subject: Nonexistent observer.');
    }

    this.observers.splice(observerIndex, 1);
    console.log('Subject: Detached an observer.');
    // this.logger.debug('Subject: Detached an observer.');
  }

  /**
   * Trigger an update in each subscriber.
   */
  notify(payload: any): void {
    // eslint-disable-next-line no-restricted-syntax
    for (const observer of this.observers) {
      observer.update(this, payload);
    }
  }

  private errorHandler = async (payload: any) => {
    if (Array.isArray(this.fallbackActions)) {
      const found = this.fallbackActions.find(step => step.method === this.action.method);
      if (found) {
        for (const fallbackAction of found.actions) {
          await fallbackAction.instance[fallbackAction.method].bind(fallbackAction.instance)();
        }
      }
    }
    this.notify({ step: { status: 'error' }, error: new Error(payload.displayMessage) });
  };

  @Catch({
    displayMessage: 'process failed'
  })
  async run(): Promise<void> {
    for (const [index, action] of this.actions.entries()) {
      this.action = action;
      this.state = index + 1;
      const result = await action.instance[action.method].bind(action.instance)({
        notifier: {
          instance: this,
          func: 'notify'
        }
      });
      const stepInfo = { ...result.step };
      delete result.step;
      this.notify({ step: { name: stepInfo.name, status: 'completed' }, ...result });
    }
  }
}
