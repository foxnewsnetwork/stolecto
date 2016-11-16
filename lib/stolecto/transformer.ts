import { Field } from './field';
import { Model, Payload } from './model';

export interface Transformer {
  typeName: string;
  normalize(payload: Payload): Model;
  serialize(model: Model): Payload;
}

// export const StringTransformer: Transformer = {
//   isPrimitive: true,
//   typeName: 'string',
//   mutate(value) {
//     return { value, command: 'set' };
//   },
//   query(field) {
//     return { field, command: 'get' };
//   },
//   get(model, f) {
//     const { fieldName } = f;
//     return model[fieldName];
//   },
//   normalize(payload) {
//     return payload;
//   }
// }
