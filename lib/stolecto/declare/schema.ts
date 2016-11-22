import { Model } from './model';
import { KeyMap, Command, Jason } from '../support/base-types';

export enum SelfType { Primitive, Advanced }

export interface SchemaAPI<Schema> {
  createSchema: (childSchemas?: KeyMap<Schema>) => Schema;
  parseResponse: (schema: Schema, c: Command, response: Jason) => Model;
  selfType: (schema: Schema) => SelfType;
  childSchemas: (schema: Schema) => KeyMap<Schema>;
}
