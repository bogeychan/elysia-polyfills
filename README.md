# @bogeychan/elysia-polyfills

Collection of experimental [Elysia.js](https://elysiajs.com) polyfills:

| Package                                            | [Node.js](https://nodejs.org) (v18.16.0) | [Deno](https://deno.land) (1.32.5) |
| -------------------------------------------------- | ---------------------------------------- | ---------------------------------- |
| [elysia](https://npmjs.com/package/elysia) (0.4.9) | 🔬                                       | 🔬                                 |
| ...                                                | ...                                      | ...                                |

**_Legend_**

🔬 - Under testing

✅ - Fully supported

⚠️ - Partial supported

❌ - Unsupported

## Installation

```bash
yarn add @bogeychan/elysia-polyfills
```

## Usage

Checkout the [examples](./examples) folder on Github and follow its setup guide.

### Node.js

```ts
import '@bogeychan/elysia-polyfills/node/index.js';

import { Elysia } from 'elysia';

new Elysia().get('/', () => ({ hello: 'Node.js👋' })).listen(8080);
```

### Deno

```ts
import 'npm:@bogeychan/elysia-polyfills/deno/index.js';

import { Elysia } from 'npm:elysia';

new Elysia().get('/', () => ({ hello: 'Deno👋' })).listen(8080);
```

## Author

[bogeychan](https://github.com/bogeychan)

## License

[MIT](LICENSE)
