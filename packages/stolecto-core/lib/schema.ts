import { Model, createModel } from './model';
import { Field } from './field';

export type Command = string | symbol

export interface Fields {
  [propName: string]: Field
}

export interface Schema {
  fields: Fields;
  get<T>(model: Model, field: Field): T;
  normalize: (response: JSON, state) => Model;
  serialize: (cmd: Command, model: Model, state) => JSON;
}

export function createSchema(fields: Fields): Schema {
  for(let fieldName in fields) {
    let field = fields[fieldName];
    field.fieldName = fieldName;
  }
  const schema: Schema = {
    fields,
    get(model, field) {
      return field.getValue(model);
    },
    normalize(payload, state) {
      return createModel(schema, payload);
    },
    serialize(cmd, model, state) {
      return { };
    }
  };
  return schema;
}
