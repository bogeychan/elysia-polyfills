# @bogeychan/elysia-polyfills

Collection of experimental [Elysia.js](https://elysiajs.com) polyfills:

| Package                                                                      | [Node.js](https://nodejs.org) (v18.16.0)      | [Deno](https://deno.land) (1.36.4<sup>#1,3</sup>) |
| ---------------------------------------------------------------------------- | --------------------------------------------- | ------------------------------------------------- |
| [elysia](https://npmjs.com/package/elysia) (0.6.19<sup>#2</sup>)             | 🔬                                            | 🔬                                                |
| [@elysiajs/cors](https://www.npmjs.com/package/@elysiajs/cors) (0.6.0)       | ✅                                            | ✅                                                |
| [@elysiajs/html](https://www.npmjs.com/package/@elysiajs/html) (0.6.4)       | ✅                                            | ✅                                                |
| [@elysiajs/bearer](https://www.npmjs.com/package/@elysiajs/bearer) (0.6.0)   | ✅                                            | ✅                                                |
| [@elysiajs/cookie](https://www.npmjs.com/package/@elysiajs/cookie) (0.6.1)   | ⚠️ (doesn't support setting multiple cookies) | ✅                                                |
| [@elysiajs/swagger](https://www.npmjs.com/package/@elysiajs/swagger) (0.6.1) | ✅                                            | ✅                                                |
| [@elysiajs/static](https://www.npmjs.com/package/@elysiajs/static) (0.6.0)   | ✅                                            | ✅                                                |
| ...                                                                          | ...                                           | ...                                               |

**_Legend_**

🔬 - Under testing

✅ - Fully supported

⚠️ - Partial supported

❌ - Unsupported

## 🚩Notes

<sup>#1</sup> With release [1.33.0](https://github.com/denoland/deno/releases/tag/v1.33.0), `Deno` introduced a new way to resolve `node_modules` dependencies. You need to update `@bogeychan/elysia-polyfills` to at least version `0.0.7` in order to be compatible.

<sup>#2</sup> With version [0.5.15](https://github.com/elysiajs/elysia/issues/50), `Elysia.js` supports `CommonJS`. Therefore, a build step is no longer required. The plugins listed above can be used out of the box for `ESM` and `CommonJS` projects.

<sup>#3</sup> With release [1.35.0](https://github.com/denoland/deno/releases/tag/v1.35.0), `Deno` stabilized the `Deno.serve()` API. From now on `Deno.serve()` is used instead of the [Deno Standard Modules](https://github.com/denoland/deno_std).

## Installation

```bash
yarn add @bogeychan/elysia-polyfills
```

## Usage

Checkout the [examples](./examples) folder on Github and follow its setup guide.

**_OR_** use an [Elysia.js scaffold](https://www.npmjs.com/package/create-elysia).

### Node.js

```ts
import '@bogeychan/elysia-polyfills/node/index.js';

import { Elysia } from 'elysia';

new Elysia().get('/', () => ({ hello: 'Node.js👋' })).listen(8080);
```

Create a new `Node.js` project:

```bash
npm create elysia@latest my-elysia-app --template node-ts
```

### Deno

```ts
import 'npm:@bogeychan/elysia-polyfills/deno/index.js';

import { Elysia } from 'npm:elysia';

new Elysia().get('/', () => ({ hello: 'Deno👋' })).listen(8080);
```

Create a new `Deno` project:

```bash
deno run -r=npm:create-elysia --allow-read --allow-write npm:create-elysia my-elysia-app --template deno
```

## Author

[bogeychan](https://github.com/bogeychan)

## License

[MIT](LICENSE)

