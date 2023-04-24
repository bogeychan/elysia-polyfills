/// <reference path="./modules.d.ts" />

import { Elysia } from 'elysia';
import { assert } from 'chai';

const req = () => new Request('http://localhost/');

// --- CORS

import { cors } from '@elysiajs/cors';

{
  const app = new Elysia().use(cors()).get('/', () => '@elysiajs/cors');

  const res = await app.handle(req());
  assert.equal(res.headers.get('Access-Control-Allow-Origin'), '*');
}

// --- HTML

import { html } from '@elysiajs/html';

const page = `<!DOCTYPE HTML>
<html lang="en">
    <head>
        <title>Hello World</title>
    </head>
    <body>
        <h1>Hello World</h1>
    </body>
</html>`;

{
  const app = new Elysia().use(html()).get('/', ({ html }) => html(page));

  const res = await app.handle(req());
  assert.equal(await res.text(), page);
  assert.equal(res.headers.get('Content-Type'), 'text/html');
}

// --- Bearer

import { bearer } from '@elysiajs/bearer';

{
  const app = new Elysia().use(bearer()).get('/sign', ({ bearer }) => bearer, {
    beforeHandle({ bearer, set }) {
      if (!bearer) {
        set.status = 400;
        set.headers[
          'WWW-Authenticate'
        ] = `Bearer realm='sign', error="invalid_request"`;

        return 'Unauthorized';
      }
    }
  });

  {
    // Header
    const res = await app
      .handle(
        new Request('http://localhost/sign', {
          headers: {
            Authorization: 'Bearer elysia'
          }
        })
      )
      .then((r) => r.text());
  }

  {
    // Query
    const res = await app
      .handle(new Request('http://localhost/sign?access_token=elysia'))
      .then((r) => r.text());

    assert.equal(res, 'elysia');
  }
}

// --- CORS

import { cookie } from '@elysiajs/cookie';

{
  // set cookie

  const app = new Elysia()
    .use(cookie())
    .get('/', ({ cookie: { user }, setCookie }) => {
      setCookie('user', 'elysia');

      return user;
    });

  const res = await app.handle(req());
  assert.equal(res.headers.get('set-cookie'), 'user=elysia; Path=/');
}

{
  // remove cookie

  const app = new Elysia().use(cookie()).get('/', ({ removeCookie }) => {
    removeCookie('user');

    return 'unset';
  });

  const res = await app.handle(
    new Request('http://localhost/', {
      headers: {
        cookie: 'user=elysia'
      }
    })
  );

  assert.equal(
    res.headers.get('set-cookie'),
    'user=; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
  );
}

{
  // sign cookie

  const app = new Elysia()
    .use(
      cookie({
        secret: 'Bun'
      })
    )
    .get('/', ({ setCookie }) => {
      setCookie('name', 'elysia', {
        signed: true
      });

      return 'unset';
    });

  const res = await app.handle(req());
  assert.isTrue(res.headers.get('set-cookie')?.includes('.'));
}

{
  // unsign cookie

  const app = new Elysia()
    .use(
      cookie({
        secret: 'Bun'
      })
    )
    .get('/', ({ setCookie }) => {
      setCookie('name', 'elysia', {
        signed: true
      });

      return 'unset';
    })
    .get('/unsign', ({ cookie, unsignCookie }) => {
      const { value } = unsignCookie(cookie.name);
      return value;
    });

  const authen = await app.handle(req());
  const res = await app
    .handle(
      new Request('http://localhost:8080/unsign', {
        headers: {
          cookie: authen.headers.get('set-cookie') ?? ''
        }
      })
    )
    .then((r) => r.text());

  assert.equal(res, 'elysia');
}

// TODO     -> how to handle "headers.getAll" ?
//* Node.js -> Property 'getAll' does not exist on type 'Headers'
//* Deno    -> error: Uncaught TypeError: res.headers.getAll is not a function
// {
//   // set multiple cookies

//   const app = new Elysia()
//     .use(cookie())
//     .get('/', ({ cookie: { user }, setCookie }) => {
//       setCookie('a', 'b');
//       setCookie('c', 'd');

//       return user;
//     });

//   const res = await app.handle(req());
//   assert.deepEqual(res.headers.getAll('Set-Cookie'), [
//     'a=b; Path=/',
//     'c=d; Path=/'
//   ]);
// }
