/// <reference types="@types/node" />

import type {
  TBunServeOptions,
  TBunFileBlob,
  TBunServer,
  TElysiaBun,
  TElysiaServer
} from '../../elysia-bun-types.js';

import fs from 'node:fs';
import http from 'node:http';
import https from 'node:https';
import { Blob } from 'node:buffer';
import { request } from './request.js';
import { response } from './response.js';
import { ensureDefaults } from '../../config.js';
import { handleError } from '../error.js';

const ElysiaBun: TElysiaBun = {
  // @ts-ignore UnixServeOptions
  serve<T>(options: TBunServeOptions<T>) {
    const { hostname, port, key, cert } = ensureDefaults(options);

    let isRunning = false;
    let shutdown: { closeAll?: boolean };

    // @ts-expect-error
    const server: TElysiaServer = {
      id: '',
      port,
      hostname,
      pendingRequests: 0,
      pendingWebSockets: 0,
      development: options.development ?? process.env.NODE_ENV !== 'production',
      fetch: (request: Request) =>
        options.fetch.call(
          server as TBunServer,
          request,
          server as TBunServer
        ) as ReturnType<TElysiaServer['fetch']>,
      stop() {}, // lazy
      reload(newOptions) {
        if (newOptions.fetch) {
          options.fetch = newOptions.fetch;
        }
      },
      url: new URL(`${key && cert ? 'https' : 'http'}://${hostname}:${port}`)
    };

    const handler: http.RequestListener<
      typeof http.IncomingMessage,
      typeof http.ServerResponse
    > = async (req, res) => {
      try {
        const my_request = await request(req as http.IncomingMessage, options);

        let my_response: Response;

        try {
          my_response = await server.fetch(my_request);
        } catch (error) {
          my_response = await handleError(options, server, error);
        }

        await response(my_response, res);
      } finally {
        res.end();
      }
    };

    const httpServer =
      key && cert
        ? https.createServer({ key, cert }, handler)
        : http.createServer(handler);

    server.stop = (closeActiveConnections) => {
      if (!isRunning) {
        // lazy
        shutdown = { closeAll: closeActiveConnections };
        return;
      }

      if (closeActiveConnections) {
        httpServer.closeAllConnections();
      }
      httpServer.close((error) => {
        if (error) {
          console.error(error);
        }
      });
      setImmediate(() => httpServer.emit('close'));
    };

    httpServer.listen(port, hostname, () => {
      isRunning = true;

      if (shutdown) {
        server.stop(shutdown.closeAll);
      }
    });

    return server as TBunServer;
  },
  gc() {}, // noop
  file(path, options) {
    const buffer = fs.readFileSync(path as string);
    return new Blob([buffer], { type: options?.type }) as TBunFileBlob;
  }
};

// @ts-ignore
globalThis.Bun = ElysiaBun;

