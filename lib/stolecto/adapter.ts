import { Command, Promise } from './base-types';
import { Model } from './model';
import { IO } from './io';

export interface Adapters {
  [propName: string]: Adapter;
}
export interface Adapter {
  run: (s: Singleset) => Promise<Model>;
}
export interface AdapterCore {
  io: IO;
  makeURI(c: Command, params, model: Model): string;
}

export function createAdapter(e: Enhancer | AdapterCore, ac: AdapterCore): Adapter {
  if(isEnhancer(e)) {
    return e(createAdapter)(ac);
  }
  else {
    let actualAC = e;
    return createDefaultAdapter(actualAC);
  }
}

function createDefaultAdapter(ac: AdapterCore): Adapter {
  return {
    run(singleset) {
      const { command, params, model, schema } = singleset;
      const uri = ac.makeURI(command, params, model);
      return ac.io.makeRequest(uri).then(schema.normalize);
    }
  };
}

export function adapterFor(adapters: Adapters, singleset: Singleset): Adapter {
  const { name } = singleset;
  return adapters[name];
}
