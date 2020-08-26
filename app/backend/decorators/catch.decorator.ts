import 'reflect-metadata';

const catchDecoratorStore = {
  handler: null,
  setHandler(handler) {
    this.handler = handler;
  }
};

const catchFunction = (payload: any = {}, toReflect: boolean = false) => {
  return function(target, key, descriptor) {
    if (toReflect) {
      Reflect.defineMetadata(key, true, target, key);
    }
    if (descriptor === undefined) {
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

        // TODO Vadim should use logging service
        if (payload.localHandler) {
          payload.localHandler.call(null, extendedError, this);
        } else if (handler) {
          handler.call(null, extendedError, this);
        } else {
          throw new Error(displayMessage);
        }
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
      if (Reflect.getMetadata(propertyName, target.prototype, propertyName))
        continue;
      let descriptor = Object.getOwnPropertyDescriptor(target.prototype, propertyName);
      const isMethod = descriptor.value instanceof Function;
      if (!isMethod)
        continue;
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
