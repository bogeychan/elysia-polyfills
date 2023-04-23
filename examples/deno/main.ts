import '@bogeychan/elysia-polyfills/deno/index.js';
import '@sinclair/typebox'; // deno doesn't download peerDependencies. this one is required
import { Elysia } from 'elysia';

// import 'npm:@bogeychan/elysia-polyfills/deno/index.js';
// import 'npm:@sinclair/typebox@0.26.0';
// import { Elysia } from 'npm:elysia@0.4.9';

const app = new Elysia()
  .get('/', () => ({ hello: 'Deno👋' }))
  .post('/:world', (ctx) => `Hello ${ctx.params.world}`)
  .listen(8080);

console.log(`Listening on http://localhost:${app.server!.port}`);

