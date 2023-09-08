require('@bogeychan/elysia-polyfills/node/index.js');

const { Elysia } = require('elysia');
const { cookie } = require('@elysiajs/cookie');
const { swagger } = require('@elysiajs/swagger');

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
  .listen(8080);

console.log(`Listening on http://localhost:${app.server?.port}`);
