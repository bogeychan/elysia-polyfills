declare namespace Deno {
  interface Server {
    [Symbol.asyncIterator](): AsyncGenerator<Conn>;
    close(): void;
  }

  interface Conn {}

  interface HTTPConn extends Conn {
    [Symbol.asyncIterator](): AsyncGenerator<RequestInfo>;
  }

  interface RequestInfo {
    request: Request;
    respondWith(response: Response): void;
  }
}

const Deno: {
  listen(options: { port: number; hostname: string }): Deno.Server;
  serveHttp(connection: Deno.Conn): Deno.HTTPConn;
};
