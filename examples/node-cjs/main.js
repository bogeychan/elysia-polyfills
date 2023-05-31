require('@bogeychan/elysia-polyfills/node/index.js');

const { Elysia } = require('elysia');
const { cookie } = require('@elysiajs/cookie');

const app = new Elysia()
  .use(cookie())
  .get('/', () => ({ hello: 'Node.js👋' }))
  .post('/:world', (ctx) => `Hello ${ctx.params.world}`)
  .get('/api', ({ setCookie }) => {
    setCookie('a', 'b');
    setCookie('c', 'd');

    return { my: 'json' };
  })
  .listen(8080);

console.log(`Listening on http://localhost:${app.server?.port}`);
