import { Schema } from '../declare/schema';
import { ModelAPI, ModelValue } from '../declare/model';
import reduceValues from '../utils/reduce-values';

export interface BasicModel {
  schema: Schema,
  value: ModelValue
}

const SERIALIZERS = {
  [SchemaType.Primitive](model, command) {
    const primitive = this.readValue(model);
    const fieldName = this.fieldName(model);
    return { [fieldName]: primitive };
  },
  [SchemaType.Advanced](model, command) {
    const models = this.readValue(model);
    const fieldName = this.fieldName(model);
    const reducer = (accData, model) => {
      return Object.assign(accData, this.serialize(model, command));
    };
    const values = reduceValues(models, reducer, {});

    return { [fieldName]: values };
  }
}

export class BasicModelAPI implements ModelAPI<BasicModel> {
  constructor(schemaAPI) {
    this.schemaAPI = schemaAPI;
  }
  fieldName({schema}) { return this.schemaAPI.fieldName(schema); }
  serialize(model, command) {
    const { selfType } = this.schema(model);
    return SERIALIZERS[selfType].call(this, model, command);
  }
  readValue({value}) { return value; }
  updateValue(model, value) { return Object.assign({}, model, { value }); }
}
