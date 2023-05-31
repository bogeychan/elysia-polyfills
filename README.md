# @bogeychan/elysia-polyfills

Collection of experimental [Elysia.js](https://elysiajs.com) polyfills:

| Package                                                                      | [Node.js](https://nodejs.org) (v18.16.0)      | [Deno](https://deno.land) (1.33.4<sup>#1</sup>) |
| ---------------------------------------------------------------------------- | --------------------------------------------- | ----------------------------------------------- |
| [elysia](https://npmjs.com/package/elysia) (0.5.10)                          | 🔬                                            | 🔬                                              |
| [@elysiajs/cors](https://www.npmjs.com/package/@elysiajs/cors) (0.5.0)       | ✅                                            | ✅                                              |
| [@elysiajs/html](https://www.npmjs.com/package/@elysiajs/html) (0.5.0)       | ✅                                            | ✅                                              |
| [@elysiajs/bearer](https://www.npmjs.com/package/@elysiajs/bearer) (0.5.0)   | ✅                                            | ✅                                              |
| [@elysiajs/cookie](https://www.npmjs.com/package/@elysiajs/cookie) (0.5.0)   | ⚠️ (doesn't support setting multiple cookies) | ✅                                              |
| [@elysiajs/swagger](https://www.npmjs.com/package/@elysiajs/swagger) (0.5.0) | ✅                                            | ❌                                              |
| [@elysiajs/static](https://www.npmjs.com/package/@elysiajs/static) (0.5.1)   | ✅                                            | ✅                                              |
| ...                                                                          | ...                                           | ...                                             |

**_Legend_**

🔬 - Under testing

✅ - Fully supported

⚠️ - Partial supported

❌ - Unsupported

## 🚩Notes

<sup>#1</sup> With release [1.33.0](https://github.com/denoland/deno/releases/tag/v1.33.0), `Deno` introduced a new way to resolve `node_modules` dependencies. You need to update `@bogeychan/elysia-polyfills` to at least version `0.0.7` in order to be compatible.

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

