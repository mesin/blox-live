import { Subject } from './subject.interface';
import { Observer } from './observer.interface';
import { Catch, catchDecoratorStore } from '../decorators';
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
    return {
      error: new Error(payload.displayMessage)
    };
  };

  @Catch({
    displayMessage: 'Process failed'
  })
  async run(): Promise<void> {
    for (const [index, action] of this.actions.entries()) {
      this.action = action;
      this.state = index + 1;
      let extra = {
        notifier: {
          instance: this,
          func: 'notify'
        }
      };
      if (action.params) extra = { ...extra, ...action.params };
      const result = await action.instance[action.method].bind(action.instance)(extra);
      const { error = null, step = null } = { ...result };
      if (error) {
        this.notify({ step: { status: 'error' }, error });
        return;
      } else {
        delete result.step;
        this.notify({ step: { name: step.name, status: 'completed' }, ...result });
      }
    }
  }
}
