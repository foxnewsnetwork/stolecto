import test from 'ava';
import { BasicSchemaAPI } from 'stolecto/metal/basic-schema';
import { BasicModelAPI } from 'stolecto/metal/basic-model';

const schemaAPI = new BasicSchemaAPI();
const modelAPI = new BasicModelAPI(schemaAPI);

test('createSchema', t => {
  const dogSchema = schemaAPI.createSchema()
});
