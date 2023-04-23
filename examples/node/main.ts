import '@bogeychan/elysia-polyfills/node/index.js';

import { Elysia } from 'elysia';

new Elysia()
  .get('/', () => 'Hi')
  .post('/json', (ctx) => ctx.body)
  .get('/id/:id', (ctx) => {
    ctx.set.headers['x-powered-by'] = 'benchmark';

    return `${ctx.params.id} ${ctx.query.name}`;
  })
  .listen(3000);

// console.log(`Listening on http://localhost:${app.server!.port}`);

