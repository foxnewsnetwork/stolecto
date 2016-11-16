import { Transformer } from './transformer';
import { Model, ValueStorage } from './model';
import { Command } from './base-types';

export interface Mutation {
  value?: Model,
  command: Command
}

export interface Request {
  field: Field;
  command?: Command;
}

export interface Field {
  isPrimitive: boolean;
  fieldName?: string;
  mutate(change?: Model, cmd?: Command): Mutation;
  query: (cmd?: Command) => Request;
  getValue(model: Model): Model;
  transformer: Transformer;
}

export interface FieldCreator {
  (t: Transformer): Field;
}

interface Monad {
  (f: FieldCreator): FieldCreator;
}

function createFieldCreator(m: Monad): FieldCreator {
  const fieldCreator: FieldCreator = (transformer) => {
    const field: Field = {
      transformer,
      isPrimitive: true,
      mutate(value, command) {
        return { value, command };
      },
      query(command) {
        return { field, command };
      },
      getValue(model) {
        const storage: ValueStorage = model.getValueStorage();
        return storage.get(field.fieldName);
      }
    };
    return field;
  };
  return m(fieldCreator);
}

function ID<T>(a: T) { return a; }

export const attr: FieldCreator = createFieldCreator(ID);
