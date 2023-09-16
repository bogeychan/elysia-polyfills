declare namespace Deno {
  interface Server {
    close(): void;
  }

  interface Closer {
    close(): void;
  }

  type ServeOptions = {
    port?: number;
    hostname?: string;
    onError?: (error: unknown) => Response | Promise<Response>;
  };

  type ServeTlsOptions = ServeOptions & {
    key: string;
    cert: string;
  };

  type ServeHandler = (request: Request) => Response | Promise<Response>;
}

const Deno: {
  env: {
    get(name: string): string | undefined;
  };
  readFileSync(path: string | URL): Uint8Array; // https://deno.land/api@v1.33.1?s=Deno.readFileSync
  readTextFileSync(path: string): string;

  // https://deno.land/api@v1.35.0?s=Deno.serve
  serve(
    options: Deno.ServeOptions | Deno.ServeTlsOptions,
    handler: Deno.ServeHandler
  ): Deno.Server;

  errors: {
    BadResource;
    InvalidData;
    UnexpectedEof;
    ConnectionReset;
    NotConnected;
    Http;
  };
};
