import '@bogeychan/elysia-polyfills/node/index.js';

import { Elysia } from 'elysia';
import { cookie } from '@elysiajs/cookie';
import { swagger } from '@elysiajs/swagger';

import * as fs from 'node:fs';
const key = fs.readFileSync('../../keys/localhost-key.pem', {
  encoding: 'utf-8'
});
const cert = fs.readFileSync('../../keys/localhost.pem', { encoding: 'utf-8' });

const app = new Elysia()
  .use(cookie())
  .use(swagger())
  .get('/', () => ({ hello: 'Node.js👋' }))
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

console.log(`Listening on https://localhost:${app.server!.port}`);

