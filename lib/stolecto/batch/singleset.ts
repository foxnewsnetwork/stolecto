import { Command, Primitive } from './base-types';
import { Model, isModel } from './model';
import { Schema } from './schema';

export interface Singleset {
  command: Command;
  schema: Schema;
  model?: Model;
}

export interface Queryset extends Singleset {
  params: any;
}

export interface Changes {
  [propName: string]: Model | Primitive;
}

export interface Changeset extends Singleset {
  isValid: boolean;
  changes: Changes;
}

export function createQuery(x: Model | Schema, command: Command, params): Queryset {
  if(isModel(x)) {
    return { command, params, model: x, schema: x.schema };
  } else {
    return { command, params, schema: x };
  }
}

// export function createChangeset(x: Model | Schema, command: Command, changes: Changes): Changeset {
//
// }
