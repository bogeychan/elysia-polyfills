/// <reference types="@types/node" />

import type {
  TBunServeOptions,
  TBunFileBlob,
  TBunServer,
  TElysiaBun,
  TElysiaServer
} from '../../elysia-bun-types';

import fs from 'node:fs';
import http from 'node:http';
import { Blob } from 'node:buffer';
import { request } from './request';
import { response } from './response';
import { ensureDefaults } from '../../config';

const ElysiaBun: TElysiaBun = {
  serve<T>(options: TBunServeOptions<T>) {
    const { hostname, port } = ensureDefaults(options);

    let isRunning = false;
    let shutdown: { closeAll?: boolean };

    const server: TElysiaServer = {
      port,
      hostname,
      pendingRequests: 0,
      pendingWebSockets: 0,
      development: options.development ?? process.env.NODE_ENV !== 'production',
      fetch(request) {
        const bunServer = server as TBunServer;
        return options.fetch.call(bunServer, request, bunServer) as ReturnType<
          TElysiaServer['fetch']
        >;
      },
      stop() {} // lazy
    };

    const httpServer = http.createServer(async (req, res) => {
      try {
        await response(
          await server.fetch(
            await request(req as http.IncomingMessage, options)
          ),
          res
        );
      } finally {
        res.end();
      }
    });

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
