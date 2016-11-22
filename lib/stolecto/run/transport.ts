import { Promise } from './base-types';
import { isEnhancer, Enhancer } from './enhancer';

export interface Transport {
  makeRequest: (t: Transport, uri: string, header, body) => Promise<any>;
}

const DEFAULT_TRANSPORT = {
  makeRequest() {
    return new Promise((resolve) => resolve());
  }
}

function makeDefaultTransport(t=DEFAULT_TRANSPORT): Transport {
  return t;
}

export function makeTransport(e: Enhancer | Transport, t?: Transport): Transport {
  if(isEnhancer(e)) {
    return e(makeTransport)(t);
  } else {
    return makeDefaultTransport(t);
  }
}
