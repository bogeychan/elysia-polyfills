import type { TBunHeaders } from '../elysia-bun-types';

class BunHeaders extends Headers implements TBunHeaders {
  override toJSON() {
    const entries: Record<string, string> = {};

    for (const [name, value] of this.entries()) {
      entries[name] = value;
    }

    return entries;
  }
}

class BunRequest extends Request {
  // @ts-ignore
  get headers() {
    return new BunHeaders(super.headers);
  }
}

// @ts-ignore
globalThis.Headers = BunHeaders;
// @ts-ignore
globalThis.Request = BunRequest;
