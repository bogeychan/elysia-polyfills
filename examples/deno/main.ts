import '@bogeychan/elysia-polyfills/deno/index.js';
import '@sinclair/typebox'; // deno doesn't download peerDependencies. this one is required
import { Elysia } from 'elysia';

import 'chai'; // test dependency
import '@elysiajs/html';
import '@elysiajs/cors';
import '@elysiajs/bearer';
import '@elysiajs/static';
import { cookie } from '@elysiajs/cookie';
import { swagger } from '@elysiajs/swagger';

// import 'npm:@bogeychan/elysia-polyfills/deno/index.js';
// import 'npm:@sinclair/typebox@0.26.0';
// import { Elysia } from 'npm:elysia@0.4.9';

const key = Deno.readTextFileSync('../../keys/localhost-key.pem');
const cert = Deno.readTextFileSync('../../keys/localhost.pem');

new Elysia()
  .use(cookie())
  .use(swagger())
  .get('/', () => ({ hello: 'Deno👋' }))
  .post('/:world', (ctx) => `Hello ${ctx.params.world}`)
  .get('/teapot', () => {
    throw { message: "I'm a teapot", status: 418 };
  })
  .get('/api', ({ setCookie }) => {
    setCookie('a', 'b');
    setCookie('c', 'd');

    return { my: 'json' };
  })
  .listen({ key, cert, port: 8443 });

