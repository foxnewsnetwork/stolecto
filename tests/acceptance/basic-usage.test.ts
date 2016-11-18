import test from 'ava';
import { Server } from '../server';
import { OWNERS, SHOPS, ok } from '../fixtures';
import { field, fieldMT } from 'stolecto/field';
import { createSchema, StringSchema } from 'stolecto/schema';
import { createAPI } from 'stolecto/api';
import { Multi } from 'stolecto/multi';
import { createQuery } from 'stolecto/queryset';
import { createAdapter } from 'stolecto/adapter';
import { createIO } from 'stolecto/io';
import { createTransform } from 'stolecto/transform';
import { PromiseMonad, ArrayMonad } from 'stolecto/monads';
import enhanceWith from 'stolecto/enhance-with';

enum Commands { GET }
const server = new Server();
const testIO = createIO({
  makeRequest(command, uri, header, body) {
    return server.get(uri);
  }
});
const OwnerTransform = createTransform({
  normalize(schema, remoteData, appState) {
    return schema.createModel({
      name: schema.name.normalize(remoteData.name),
      shops: schema.shops.normalize(remoteData.shops)
    });
  }
});
const ShopTransform = createTransform({
  normalize(schema, remoteData, appState) {
    return schema.createModel({
      name: schema.name.normalize(remoteData.name),
      owner: schema.owner.normalize(remoteData.owner)
    });
  }
});
const OwnerSchema = createSchema(enhanceWith(OwnerTransform), () => ({
  name: field(StringSchema),
  shops: fieldMT(PromiseMonad, ArrayMonad)(ShopSchema)
}));
const ShopSchema = createSchema(enhanceWith(ShopTransform), () => ({
  name: field(StringSchema),
  owner: fieldMT(PromiseMonad)(OwnerSchema)
}));
const ShopAdapter = createAdapter(enhanceWith(testIO), {
  makeURI(command, params) { return `/shops/${params.id}`; }
});
let BasicUsageTestStorage = {};
const Storeable = {
  getState() { return BasicUsageTestStorage; }
}

const API = createAPI(enhanceWith(Storeable), {shop: ShopAdapter});

test.before(t => {
  server.register('/shops/666', () => ok(SHOPS['666']));
});
test.after(t => {
  server.shutdown();
});
test('it should work', async t => {
  const shopQS = createQuery(ShopSchema, Commands.GET, {id: '666'});
  const multiset = Multi.create({shop: shopQS});
  const { shop } = await API.run(multiset);
  const fields =[ShopSchema.id, ShopSchema.name, ShopSchema.owner];
  const { id, name, owner } = API.getProperties(shop, fields);
  const expectedShop = SHOPS['666'];

  t.deepEqual(expectedShop.id, id);
  t.deepEqual(expectedShop.name, name);

  const expectedOwner = OWNERS['12'];
  const ownerFields = [OwnerSchema.name, OwnerSchema.id];
  const { id: ownerId, name: ownerName } = API.getProperties(await owner, ownerFields);
  t.deepEqual(expectedOwner.id, ownerId);
  t.deepEqual(expectedOwner.name, owerName);
});
