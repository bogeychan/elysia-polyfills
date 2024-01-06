import type { TBunHeaders } from '../elysia-bun-types.js';

// @ts-expect-error
globalThis.Headers = class Headers
  extends globalThis.Headers
  implements TBunHeaders
{
  toJSON() {
    const entries: Record<string, string> = {};

    for (const [name, value] of this.entries()) {
      entries[name] = value;
    }

    return entries;
  }
};

globalThis.Request = class Request extends globalThis.Request {
  // @ts-expect-error
  get headers() {
    return new globalThis.Headers(
      // @ts-expect-error
      super.headers
    );
  }
};

globalThis.Response = class Response extends globalThis.Response {
  // @ts-expect-error
  get headers() {
    return new globalThis.Headers(
      // @ts-expect-error
      super.headers
    );
  }
};
