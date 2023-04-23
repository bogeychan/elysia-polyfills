/// <reference types="@types/node" />

import type http from 'node:http';
import type { TBunServeOptions } from '../../elysia-bun-types';

import { toHeaders, toReadableStream } from './utils';

export async function request<T>(
  req: http.IncomingMessage,
  { hostname, port }: TBunServeOptions<T>
): Promise<Request> {
  const stream = toReadableStream(req);

  return new Promise((res, rej) => {
    req.on('end', async () => {
      try {
        //! TypeError: Failed to parse URL from /
        const url = `http://${hostname}:${port}${req.url}`;

        const init: RequestInit = {
          headers: toHeaders(req.headers),
          method: req.method!
        };

        //! TypeError: Request with GET/HEAD method cannot have body.
        switch (req.method) {
          case 'GET':
          case 'HEAD':
            stream.cancel('Request with GET/HEAD method cannot have body');
            break;
          default:
            init.body = stream;
            // @ts-ignore
            init.duplex = 'half';
            break;
        }

        res(new Request(url, init));
      } catch (error) {
        rej(error);
      }
    });

    req.on('error', (error) => {
      rej(error);
    });
  });
}

