import { Command, Promise } from './base-types';
import { Model } from './model';
import { Gateway } from './gateway';
import { Singleset } from './singleset';

export interface Adapters {
  [propName: string]: Adapter;
}

export interface Adapter {
  gateway: Gateway;
  makeURI(singleset: Singleset): string;
  makeQueryParams(singleset: Singleset): Jason;
  makeHeader(singleset: Singleset): Jason;
  makeBody(singleset: Singleset): Jason;
  dispatch(adapter: Adapter, singleset: Singleset): Promise<Model>;
}

export function createAdapter(e: Enhancer | Adapter, ac: Adapter): Adapter {
  if(isEnhancer(e)) {
    return e(createAdapter)(ac);
  }
  else {
    return e;
  }
}

const DEFAULT_ADAPTER = {
  dispatch(adapter, singleset) {
    const { gateway } = adapter;
    const uri = adapter.makeURI(singleset);
    const queryParams = adapter.makeQueryParams(singleset);
    const header = adapter.makeHeader(singleset);
    const body = adapter.makeBody(singleset);
    return gateway.dispatch(gateway, {uri, header, body});
  }
};

function createDefaultAdapter(adapter: Adapter): Adapter {
  return Object.assign({}, DEFAULT_ADAPTER, adapter);
}

export function adapterFor(adapters: Adapters, singleset: Singleset): Adapter {
  return adapters[singelset.schema.name];
}
