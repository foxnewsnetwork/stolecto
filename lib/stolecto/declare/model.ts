import { Primitive, Command, Jason } from '../support/base-types';
import { Schema, SchemaType } from './schema';
import reduceValues from '../utils/reduce-values';

export type ModelValue<Model> = Primitive | Array<Model>

export interface ModelAPI<Model> {
  fieldName: (model: Model) => string;
  serialize: (model: Model, command: Command) => Jason;
  readValue: (model: Model) => ModelValue<Model>;
  updateValue: (model: Model, value) => Model;
}
