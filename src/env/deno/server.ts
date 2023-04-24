/// <reference path="./deno-types.d.ts" />

import type {
  TBunServeOptions,
  TBunServer,
  TElysiaBun,
  TElysiaServer
} from '../../elysia-bun-types';

import { ensureDefaults } from '../../config';

const ElysiaBun: TElysiaBun = {
  serve<T>(options: TBunServeOptions<T>) {
    const { hostname, port } = ensureDefaults(options);

    const denoServer = Deno.listen({ hostname, port });

    if (typeof options.development === 'undefined') {
      options.development = Deno.env.get('NODE_ENV') !== 'production';
    }

    const server: TElysiaServer = {
      port,
      hostname,
      development: options.development,
      pendingRequests: 0,
      pendingWebSockets: 0,
      fetch(request) {
        // @ts-ignore
        return options.fetch.call(server, request, server) as ReturnType<
          TElysiaServer['fetch']
        >;
      },
      stop() {
        denoServer.close();
      }
    };

    async function acceptConnections(server: Deno.Server) {
      for await (const connection of server) {
        void serve(connection);
      }
    }

    async function serve(connection: Deno.Conn) {
      for await (const { request, respondWith } of Deno.serveHttp(connection)) {
        respondWith(await server.fetch(request));
      }
    }

    void acceptConnections(denoServer);

    return server as TBunServer;
  },
  gc() {} // noop
};

// @ts-ignore
globalThis.Bun = ElysiaBun;