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
