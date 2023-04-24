import '@bogeychan/elysia-polyfills/node/index.js';

import { Elysia } from 'elysia';
import { html } from '@elysiajs/html';

const app = new Elysia()
  .use(html())
  .get('/', () => ({ hello: 'Node.js👋' }))
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

