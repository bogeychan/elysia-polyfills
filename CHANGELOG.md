# 0.5.2 - 04 Jun 2023

Improvement:

- with version [0.5.15](https://github.com/elysiajs/elysia/issues/50), `Elysia.js` supports `CommonJS`. Therefore, a build step is no longer required.

# 0.5.1 - 01 Jun 2023

Feature:

- CommonJS support

Bug fix:

- elysia runtime function check

# 0.5.0 - 31 Mai 2023

Bug fix:

- updated dependencies including support for `Elysia.js` Version `0.5.9`

# 0.0.7 - 01 Mai 2023

Feature:

- support & tests for `@elysiajs/static`

Bug fix:

- nested dependencies with `Deno` & `Node.js`

# 0.0.6 - 28 Apr 2023

Bug fix:

- with release [1.33.0](https://github.com/denoland/deno/releases/tag/v1.33.0), `Deno` introduced a new way to resolve `node_modules` dependencies

# 0.0.5 - 24 Apr 2023

Improvement:

- add `Deno` tests for `cors` & `html`
- move `typescript` to `devDependencies`

# 0.0.4 - 24 Apr 2023

Feature:

- cli transpile additional packages

Improvement:

- `Node.js` example & tests for `@elysiajs/cors`, `@elysiajs/html`

# 0.0.3 - 24 Apr 2023

Improvement:

- use `Deno.env.get` instead of `process.env.NODE_ENV`
- use `Deno.listen` instead of `Node.js` polyfill

# 0.0.2 - 23 Apr 2023

Bug fix:

- add `Node.js` request body `duplex`

# 0.0.1 - 23 Apr 2023

Feature:

- `Node.js` & `Deno`
