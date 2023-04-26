/// <reference path="./modules.d.ts" />

import { assert } from 'chai';
import { Elysia } from 'elysia';

const TEST_BLOCKS: { [moduleName: string]: TestBlock } = {}; // ignore this :D

const req = (path: string = '/') => new Request(`http://localhost${path}`);

use(
  '@elysiajs/cors',
  () => import('@elysiajs/cors'),
  ({ cors }) => {
    it('default', async () => {
      const app = new Elysia().use(cors()).get('/', () => '@elysiajs/cors');

      const res = await app.handle(req());
      assert.equal(res.headers.get('Access-Control-Allow-Origin'), '*');
    });
  }
);

use(
  '@elysiajs/html',
  () => import('@elysiajs/html'),
  ({ html }) => {
    const page = `<!DOCTYPE HTML>
  <html lang="en">
      <head>
          <title>Hello World</title>
      </head>
      <body>
          <h1>Hello World</h1>
      </body>
  </html>`;

    it('default', async () => {
      const app = new Elysia().use(html()).get('/', ({ html }) => html(page));

      const res = await app.handle(req());
      assert.equal(await res.text(), page);
      assert.equal(res.headers.get('Content-Type'), 'text/html');
    });
  }
);

use(
  '@elysiajs/bearer',
  () => import('@elysiajs/bearer'),
  ({ bearer }) => {
    const app = new Elysia()
      .use(bearer())
      .get('/sign', ({ bearer }) => bearer, {
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

    it('Header', async () => {
      const res = await app
        .handle(
          new Request('http://localhost/sign', {
            headers: {
              Authorization: 'Bearer elysia'
            }
          })
        )
        .then((r) => r.text());

      assert.equal(res, 'elysia');
    });

    it('Query', async () => {
      const res = await app
        .handle(new Request('http://localhost/sign?access_token=elysia'))
        .then((r) => r.text());

      assert.equal(res, 'elysia');
    });
  }
);

use(
  '@elysiajs/cookie',
  () => import('@elysiajs/cookie'),
  ({ cookie }) => {
    it('set cookie', async () => {
      const app = new Elysia()
        .use(cookie())
        .get('/', ({ cookie: { user }, setCookie }) => {
          setCookie('user', 'elysia');

          return user;
        });

      const res = await app.handle(req());
      assert.equal(res.headers.get('set-cookie'), 'user=elysia; Path=/');
    });

    it('remove cookie', async () => {
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
    });

    it('sign cookie', async () => {
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
    });

    it('unsign cookie', async () => {
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
    });

    it('set multiple cookies', async () => {
      // TODO     -> how to handle "headers.getAll" ?
      //* Node.js -> Property 'getAll' does not exist on type 'Headers'
      //* Deno    -> error: Uncaught TypeError: res.headers.getAll is not a function
      // {
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
    });
  }
);

use(
  '@elysiajs/swagger',
  () => import('@elysiajs/swagger'),
  ({ swagger }) => {
    it('show swagger page', async () => {
      const app = new Elysia().use(swagger());
      const res = await app.handle(req('/swagger'));
      assert.equal(res.status, 200);
    });

    it('use custom Swagger version', async () => {
      const app = new Elysia().use(
        swagger({
          version: '4.5.0'
        })
      );
      const res = await app.handle(req('/swagger')).then((x) => x.text());
      assert.isTrue(
        res.includes(
          'https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui-bundle.js'
        )
      );
    });

    it('follow title and description', async () => {
      const app = new Elysia().use(
        swagger({
          version: '4.5.0',
          documentation: {
            info: {
              title: 'Elysia Documentation',
              description: 'Herrscher of Human',
              version: '1.0.0'
            }
          }
        })
      );
      const res = await app.handle(req('/swagger')).then((x) => x.text());
      assert.isTrue(res.includes('<title>Elysia Documentation</title>'));
      assert.isTrue(
        res.includes(
          `<meta
        name="description"
        content="Herrscher of Human"
    />`
        )
      );
    });

    it('use custom path', async () => {
      const app = new Elysia().use(
        swagger({
          path: '/v2/swagger'
        })
      );
      const res = await app.handle(req('/v2/swagger'));
      assert.equal(res.status, 200);
    });
  }
);

// --- TEST UTILS

type TestResult = void | Promise<void>;
type TestCallback = () => TestResult;
type Test = {
  description: string;
  callback: TestCallback;
};

type TestBlock = {
  tests: Test[];
  callback: () => Promise<void>;
  moduleName: string;
};

let currentModuleName: string;

export async function runTests(env: 'node' | 'deno') {
  for (const moduleName in TEST_BLOCKS) {
    const block = TEST_BLOCKS[moduleName];

    if (env === 'deno' && moduleName === '@elysiajs/swagger') {
      console.log(`⏩ Skipping ${moduleName}`);
      continue;
    }

    console.log((currentModuleName = moduleName));

    await block.callback();

    for (const test of block.tests) {
      try {
        await test.callback();
        console.log(`\t✅ ${test.description}`);
      } catch (error) {
        console.error(`\t❌ ${test.description}\n\n`, error);
        // @ts-ignore
        (process ?? Deno).exit(1);
      }
    }
  }
}

function use(
  moduleName: string,
  typedImport: () => Promise<any>,
  callback: (module: any) => void
) {
  TEST_BLOCKS[moduleName] = {
    moduleName,
    callback: async () => {
      const module = await typedImport();

      //? https://github.com/denoland/deno/issues/16088
      //! https://github.com/denoland/deno/issues/15826#issuecomment-1324365924
      // callback(await import(moduleName));

      callback(module);
    },
    tests: []
  };
}

function it(this: string | void, description: string, callback: TestCallback) {
  TEST_BLOCKS[currentModuleName].tests.push({ description, callback });
}
