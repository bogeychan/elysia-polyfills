import type { TBunHeaders } from '../elysia-bun-types.js';

// @ts-expect-error
class BunHeaders extends Headers implements TBunHeaders {
  toJSON() {
    const entries: Record<string, string> = {};

    for (const [name, value] of this.entries()) {
      entries[name] = value;
    }

    return entries;
  }
}

class BunRequest extends Request {
  // @ts-expect-error
  get headers() {
    // @ts-expect-error
    return new BunHeaders(super.headers);
  }
}

// @ts-ignore
globalThis.Headers = BunHeaders;
// @ts-ignore
globalThis.Request = BunRequest;
