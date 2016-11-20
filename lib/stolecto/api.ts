import { Enhancer, isEnhancer } from './enhancer';
import Multi from './multi';
import { Promise } from './base-types';
import Field from './field';
import { Model, getModel } from './model';
import { Adapters, adapterFor } from './adapter';

export interface API {
  run: (multiset: Multi) => Promise<Model>;
  getProperties: (model: Model, fields: Array<Field>) => Models;
}
export interface Models {
  [propName: string]: Model;
}

function createDefaultAPI(adapters: Adapters): API {
  return {
    run(multiset) {
      return multiset.map((singleset) => {
        const adapter = adapterFor(adapters, singleset);
        const { schema } = singleset;
        return adapter.dispatch(singleset).then(schema.normalize);
      });
    },
    getProperties(model, fields) {
      return fields.reduce((output, field) => {
        output[field.name] = getModel(model, field);
        return output;
      }, {});
    }
  }
};
export default function createAPI(enhancer: Enhancer | Adapters, adapters: Adapters): API {
  if(isEnhancer(enhancer)) {
    return enhancer(createAPI)(adapters);
  } else {
    let actualAdapters = enhancer;
    return createDefaultAPI(actualAdapters);
  }
}
