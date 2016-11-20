import { Jason } from './base-types';
import { Transport } from './transport';

export interface Gateset {
  uri: string,
  queryParams?: Jason,
  header?: Jason,
  body?: Jason
}
export interface Gateway {
  transport: Transport;
  dispatch: (gateway: Gateway, s: Gateset) => Promise<any>;
}

export interface Gateways {
  [propName: string]: Gateway;
}

export function createGateway(e: Enhancer | Gateway, gateway: Gateway): Gateway {
  if(isEnhancer(e)) {
    return e(createGateway)(gateway);
  }
  else {
    return createDefaultGateway(e);
  }
}

const DEFAULT_GATEWAY = {
  dispatch(gateway, gateset) {
    const { transport } = gateway;
    const { uri, header, body } = gateset;
    return transport.makeRequest(transport, uri, header, body);
  }
};

function createDefaultGateway(gateway: Gateway): Gateway {
  return Object.assign({}, DEFAULT_GATEWAY, gateway);
}
