import { createSchema } from 'stolecto-core/schema';
import { attr } from 'stolecto-core/field';
import Types from 'stolecto-core/types';

const { string, number } = Types;

export const Fields = {
  name: attr(string),
  nickname: attr(string),
  price: attr(number)
};

export default createSchema(Fields);
