import 'reflect-metadata';
import { Logger } from '../common/logger/logger';

const catchDecoratorStore = {
  handler: null,
  setHandler(handler) {
    this.handler = handler;
  }
};

const catchFunction = (payload: any = {}, toReflect: boolean = false) => {
  return function(target, key, descriptor) {
    const logger = new Logger();
    if (toReflect) {
      Reflect.defineMetadata(key, true, target, key);
    }
    if (descriptor === undefined) {
      // no-param-reassign
      descriptor = Object.getOwnPropertyDescriptor(target, key);
    }
    const originalMethod = descriptor.value;
    descriptor.value = async function(...args) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        const { handler } = catchDecoratorStore;
        const displayMessage = payload.displayMessage ? payload.displayMessage : `${key} failed`;
        const extendedError = { error, displayMessage };
        console.error(extendedError);
        logger.error(displayMessage, error);
        if (payload.localHandler) {
          return payload.localHandler.call(null, extendedError, this);
        }
        if (handler) {
          return handler.call(null, extendedError, this);
        }
        throw new Error(displayMessage);
      }
    };
    return descriptor;
  };
};

function Catch(payload: any = {}, toReflect: boolean = true) {
  return catchFunction(payload, toReflect);
}

function CatchClass<T>(payload: any = {}) {
  return function(target: new (...params: any[]) => T) {
    for (const propertyName of Object.getOwnPropertyNames(target.prototype)) {
      if (Reflect.getMetadata(propertyName, target.prototype, propertyName)) {
        continue;
      }
      let descriptor = Object.getOwnPropertyDescriptor(target.prototype, propertyName);
      if (descriptor) {
        descriptor = Catch(payload, false)(target, propertyName, descriptor);
        Object.defineProperty(target.prototype, propertyName, descriptor);
      }
    }
  };
}

export {
  Catch,
  CatchClass,
  catchDecoratorStore
};
