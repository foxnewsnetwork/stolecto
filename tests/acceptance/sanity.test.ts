import test from 'ava';
import { Server } from '../server';
import { JSON_TYPE, SHOPS, OWNERS, all } from '../fixtures';

function routes(server) {
  server.register('/shops', () => {
    return [200, JSON_TYPE, all(SHOPS)];
  });
  server.register('/shops/666', () => {
    return [200, JSON_TYPE, SHOPS['666']];
  });
  server.register('/owners', () => {
    return [200, JSON_TYPE, all(OWNERS)];
  });
  server.register('/owners/12', () => {
    return [200, JSON_TYPE, OWNERS['12']];
  });
}

const server = new Server();

test.before(t => {
  server.map(routes);
});

test.after(t => {
  server.shutdown();
});

test('external test dependencies should be correct', async t => {
  const [status, type, data] = await server.get('/shops/666');
  t.deepEqual(status, 200);
  t.deepEqual(type, JSON_TYPE);
  t.deepEqual(data, SHOPS['666']);
});
