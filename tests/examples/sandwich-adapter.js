import { createAdapter } from 'stoletcto-core/adapter';
import { default as Schema, Fields } from './sandwich-schema';

const Commands = {
  find: 'find',
  findAll: 'findAll'
};
const Adapters = {
  [Commands.find](model, serializer) {
    return {
      uri: `/shop/sandwiches/${Schema.get(model, Fields.id)}`,
      header: { xKey: 'xxxVegeta' },
      body: { data: serializer(model) }
    };
  },
  [Commands.findAll]() {
    return {
      uri: '/shop/sandwiches',
      header: { xKey: 'carrot' }
    }
  }
}

export default function adapter(command, model, serializer) {
  return Adapters[command](model, serializer);
}
