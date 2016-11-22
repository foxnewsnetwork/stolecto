import { Schema, SelfType } from '../declare/schema';
import { ModelAPI, ModelValue } from '../declare/model';
import reduceValues from '../utils/reduce-values';

export interface BasicModel {
  schema: Schema;
  value: ModelValue;
}

const SERIALIZERS = {
  [SelfType.Primitive](model, command) {
    return this.readValue(model);
  },
  [SelfType.Advanced](model, command) {
    const models = this.readValue(model);
    const reducer = (accData, model, fieldName) => {
      return Object.assign(accData, { [fieldName]: this.serialize(model, command) });
    };
    return reduceValues(models, reducer, {});
  }
};

export class BasicModelAPI implements ModelAPI<BasicModel> {
  schema(model) { return model.schema; }
  serialize(model, command) {
    const { selfType } = this.schema(model);
    return SERIALIZERS[selfType].call(this, model, command);
  }
  readValue(model) { return model.value; }
  readMeta(model) { return model.meta; }
  updateMeta(model, meta) { return Object.assign({}, model, { meta }); }
  updateValue(model, value) { return Object.assign({}, model, { value }); }
}
