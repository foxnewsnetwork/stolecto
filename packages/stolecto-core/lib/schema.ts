
interface Monad<T> {
  returnM: (value: T) => Monad<T>;
  failM: (msg: string) => Monad<T>;
  pipeM: (valueWithCtx: Monad<T>, f: ((rawValue: T) => Monad<any> )) => Monad<any>;
}

interface State<T> {
  init: () => State<T>;
  get: (state: State<T>, key: string) => Monad<T>;
  set: (state: State<T>, key: string) => State<T>;
  update: (state: State<T>, key: string, updater: ( (state: State<T>) => State<T> ) ) => State<T>;
}

class StateStore {

}

class SchemaProperty<T> {
  value: T;
  rev: string;
  serialize: (localState, value: T) => Primitive;
  normalize: (localState, value: Primitive) => T;
}

function attr(type, opts) {
  return new SchemaProperty({
    
  });
}
