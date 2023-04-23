import '@bogeychan/elysia-polyfills/node/index.js';

import { Elysia } from 'elysia';

const app = new Elysia()
  .get('/', () => ({ hello: 'Node.js👋' }))
  .post('/:world', (ctx) => `Hello ${ctx.params.world}`)
  .listen(8080);

console.log(`Listening on http://localhost:${app.server!.port}`);

