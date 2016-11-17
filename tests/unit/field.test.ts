import test from 'ava';
import { Adapter } from 'stolecto/adapter';

test(t => {
  t.deepEqual('sanity', 'sanity');
});

test(t => {
  t.deepEqual(Adapter, 'sanity');
});
