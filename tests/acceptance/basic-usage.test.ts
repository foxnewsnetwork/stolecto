import test from 'ava';
import { field, fieldMT } from 'stolecto/field';
import { createSchema } from 'stolecto/schema';
import { createAPI } from 'stolecto/api';
import { createMulti } from 'stolecto/multi';
import { createQuery } from 'stolecto/queryset';
import { createAdapter } from 'stolecto/adapter';
import { createIO } from 'stolecto/io-engine';
import { PromiseMonad, ArrayMonad } from 'stolecto/monads';

const fauxIO = createIO({
  makeRequest(command, uri, header, body) {
    server.
  },
  onResponse(response, appState, io) { }
});
const OwnerTransform = {
  normalize(remoteData, appState) { }
  serialize(localData, appState) { }
}
const OwnerSchema = createSchema(OwnerTransform, () => ({
  name: field(StringSchema),
  shops: fieldMT(PromiseMonad)(ArrayMonad)(ShopSchema)
}));
const ShopSchema = createSchema(ShopTransform, () => ({
  name: field(StringSchema),
  owner: fieldMT(PromiseMonad)(OwnerSchema)
}));
const ShopAdapter = createAdapter(fauxIO, {
  makeURI(command, model, appState) { },
  makeHeader(command, model, appState) { },
  makeBody(command, model, appState) { }
});
test('it should work', t => {
  const shopQS = createQuery(ShopSchema, command, params);
  const multiset = createMulti({shop: shopQS});
  const api = createAPI({shop: ShopAdapter});
  api.run(multiset).then((shop) => {
    t.deepEqual()
  });
});
