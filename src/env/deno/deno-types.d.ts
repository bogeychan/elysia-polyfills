declare namespace Deno {
  interface Server {
    [Symbol.asyncIterator](): AsyncGenerator<Conn>;
    close(): void;
  }

  interface Conn extends Closer {
    localAddr: Addr;
    remoteAddr: Addr;
  }

  interface NetAddr {
    port: number;
  }

  interface Listener extends Closer {
    accept(): Promise<Conn>;
    addr: Addr;
  }

  interface Closer {
    close(): void;
  }

  interface HttpConn extends Conn {
    nextRequest(): Promise<RequestEvent>;
    [Symbol.asyncIterator](): AsyncGenerator<RequestEvent>;
  }

  interface RequestEvent {
    request: Request;
    respondWith(response: Response): Promise<void>;
  }

  type ListenOptions = { port: number; hostname: string; transport: 'tcp' };

  type ListenTlsOptions = ListenOptions & {
    key: string;
    cert: string;
    alpnProtocols?: string[];
  };

  interface Addr {}
}

interface Http {
  new (message: string): Error;
}

const Deno: {
  // https://deno.land/api@v1.33.4?s=Deno.listenTls
  listenTls(options: Deno.ListenTlsOptions): Deno.Listener;
  listen(options: Deno.ListenOptions): Deno.Listener;
  serveHttp(connection: Deno.Conn): Deno.HttpConn;
  env: {
    get(name: string): string | undefined;
  };
  readFileSync(path: string | URL): Uint8Array; // https://deno.land/api@v1.33.1?s=Deno.readFileSync
  readTextFileSync(path: string): string;

  errors: {
    BadResource;
    InvalidData;
    UnexpectedEof;
    ConnectionReset;
    NotConnected;
    Http;
  };
};
