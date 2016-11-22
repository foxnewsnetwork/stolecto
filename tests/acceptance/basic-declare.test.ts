import test from 'ava';
import { BasicSchemaAPI } from 'stolecto/metal/basic-schema';
import { BasicModelAPI } from 'stolecto/metal/basic-model';

const schemaAPI = new BasicSchemaAPI();
const modelAPI = new BasicModelAPI();
function field() { return schemaAPI.createSchema(); }
const dogSchema = schemaAPI.createSchema({
  name: field('string'),
  size: field('string')
});
const ServerResponse = {
  name: 'rover',
  size: 'large'
};
test('basic-schema parseResponse', t => {
  const model = schemaAPI.parseResponse(dogSchema, 'whatever', ServerResponse);
  const { name, size } = modelAPI.readValue(model);
  t.is(name.value, ServerResponse.name);
  t.deepEqual(modelAPI.readValue(name), ServerResponse.name);
  t.deepEqual(modelAPI.readValue(size), ServerResponse.size);
});
test('basic-model serialize', t => {
  const model = schemaAPI.parseResponse(dogSchema, 'whatever', ServerResponse);
  const json = modelAPI.serialize(model);

  t.deepEqual(json, ServerResponse);
});
