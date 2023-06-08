/// <reference path="./deno-types.d.ts" />

import type {
  TBunServeOptions,
  TBunServer,
  TElysiaBun,
  TBunFileBlob,
  TElysiaServer
} from '../../elysia-bun-types.js';

import { ensureDefaults } from '../../config.js';

import { Server } from './std/server.js';

const ElysiaBun: TElysiaBun = {
  serve<T>(options: TBunServeOptions<T>) {
    const { hostname, port, key, cert } = ensureDefaults(options);

    if (typeof options.development === 'undefined') {
      options.development = Deno.env.get('NODE_ENV') !== 'production';
    }

    const denoServer = new Server({
      hostname,
      port,
      handler: (request) => server.fetch(request)
    });

    const server: TElysiaServer = {
      port,
      hostname,
      development: options.development,
      pendingRequests: 0,
      pendingWebSockets: 0,
      fetch: (request: Request) =>
        options.fetch.call(
          server as TBunServer,
          request,
          server as TBunServer
        ) as ReturnType<TElysiaServer['fetch']>,
      stop() {
        try {
          denoServer.close();
        } catch {
          // Server has already been closed.
        }
      }
    };

    if (key && cert) {
      void denoServer.listenAndServeTls(cert, key);
    } else {
      void denoServer.listenAndServe();
    }

    return server as TBunServer;
  },
  gc() {}, // noop
  file(path, options) {
    const bytes = Deno.readFileSync(path as string);
    return new Blob([bytes], { type: options?.type }) as TBunFileBlob;
  }
};

// @ts-ignore
globalThis.Bun = ElysiaBun;
