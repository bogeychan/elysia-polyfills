import '@bogeychan/elysia-polyfills/deno/index.js';
import '@sinclair/typebox'; // deno doesn't download peerDependencies. this one is required
import { Elysia } from 'elysia';

import 'chai'; // test dependency
import '@elysiajs/cors';
import { html } from '@elysiajs/html';

// import 'npm:@bogeychan/elysia-polyfills/deno/index.js';
// import 'npm:@sinclair/typebox@0.26.0';
// import { Elysia } from 'npm:elysia@0.4.9';

const app = new Elysia()
  .use(html())
  .get('/', () => ({ hello: 'Deno👋' }))
  .post('/:world', (ctx) => `Hello ${ctx.params.world}`)
  .get(
    '/html',
    () => `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Document</title>
    </head>
    <body>HTML</body>
  </html>
  `
  )
  .listen(8080);

console.log(`Listening on http://localhost:${app.server!.port}`);

