import { Field } from './field';
import { Schema } from './schema';
import { Primitive } from './base-types';

export interface Model {
  schema?: Schema;
  isPrimitive: boolean;
  getValueStorage(): ValueStorage;
}

export type ValueStorage = PrimitiveStorage | ModelStorage
export interface PrimitiveStorage {
  get: () => Primitive;
  set: (p: Primitive) => PrimitiveStorage;
}
export interface ModelStorage {
  get: (key: string) => Model;
  set: (m: Model, key: string) => ModelStorage;
}

export interface Payload {
  [propName: string]: Primitive | Array<Primitive> | Payload;
}

function createPrimitiveModel(primitive: Primitive): Model {
  const storage = buildPrimitiveStorage(primitive);
  const model: Model = {
    isPrimitive: true,
    getValueStorage() { return storage; }
  };
  return model;
}

function createActualModel(schema: Schema, payload: Payload): Model {
  const storage = buildModelStorage(schema, payload);
  const model: Model = {
    schema,
    isPrimitive: true,
    getValueStorage() { return storage; }
  };
  return model;
}

export function createModel(schema: Schema, payload: Payload): Model {
  if (isPrimitive(payload)) {
    return createPrimitiveModel(payload);
  } else {
    return createActualModel(schema, payload);
  }
}

function isPrimitive(payload: Payload): boolean { return true; }

function buildModelStorage(schema: Schema, payload: Payload): ModelStorage {
  let _internals = {};
  for(let fieldName in schema.fields) {
    const field = schema.fields[fieldName];
    _internals[fieldName] = field.transformer.normalize(payload);
  }
  const storage = {
    _internals,
    get(key) { return storage._internals[key]; },
    set(model, key) {
      storage._internals[key] = model;
      return storage;
    }
  };
  return storage;
}

function buildPrimitiveStorage(value): PrimitiveStorage {
  const _internals = { value };
  const storage = {
    _internals,
    get() { return storage._internals.value; },
    set(p) {
      storage._internals.value = p;
      return storage;
    }
  };
  return storage;
}
