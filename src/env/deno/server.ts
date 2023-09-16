/// <reference path="./deno-types.d.ts" />

import type {
  TBunServeOptions,
  TBunServer,
  TElysiaBun,
  TBunFileBlob,
  TElysiaServer
} from '../../elysia-bun-types.js';

import { ensureDefaults } from '../../config.js';

import { handleError } from '../error.js';

const ElysiaBun: TElysiaBun = {
  // @ts-ignore UnixServeOptions
  serve<T>(options: TBunServeOptions<T>) {
    const { hostname, port, key, cert } = ensureDefaults(options);

    if (typeof options.development === 'undefined') {
      options.development = Deno.env.get('NODE_ENV') !== 'production';
    }

    const serveOptions: Deno.ServeOptions = {
      hostname,
      port,
      onError: (error) => handleError(options, server, error)
    };

    if (key && cert) {
      const serveTlsOptions = serveOptions as Deno.ServeTlsOptions;
      serveTlsOptions.key = key;
      serveTlsOptions.cert = cert;
    }

    let denoServer: Deno.Server;

    const server: TElysiaServer = {
      id: '',
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
      },
      reload(newOptions) {
        if (newOptions.fetch) {
          options.fetch = newOptions.fetch;
        }
      }
    };

    denoServer = Deno.serve(serveOptions, (request) => server.fetch(request));

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
