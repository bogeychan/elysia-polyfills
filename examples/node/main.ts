import '@bogeychan/elysia-polyfills/node/index.js';

import { Elysia } from 'elysia';

const app = new Elysia()
  .get('/', () => {
    return { hello: 'Node.js👋' };
  })
  .listen(8080);

console.log(`Listening on http://localhost:${app.server!.port}`);
