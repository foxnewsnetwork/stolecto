import { Primitive, Command, Jason, KeyMap } from '../support/base-types';
import { Schema } from './schema';

export type ModelValue<Model> = Primitive | KeyMap<Model>

export interface ModelAPI<Model> {
  schema: (model: Model) => Schema;
  serialize: (model: Model, command: Command) => Jason;
  readMeta: (model: Model) => Jason;
  readValue: (model: Model) => ModelValue<Model>;
  updateMeta: (model: Model, json: Jason) => Model;
  updateValue: (model: Model, value) => Model;
}
