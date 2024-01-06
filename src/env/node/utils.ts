/// <reference types="@types/node" />

import type http from 'node:http';

export function toReadableStream(req: http.IncomingMessage) {
  return new ReadableStream({
    start(controller) {
      req.on('data', (chunk) => {
        controller.enqueue(chunk);
      });
      req.on('end', () => {
        controller.close();
      });
    },
    cancel(reason) {
      req.destroy(reason);
    }
  });
}

export function toHeaders(httpHeaders: http.IncomingHttpHeaders): Headers {
  const headers = new Headers();

  for (const name in httpHeaders) {
    const values = httpHeaders[name]!;
    if (typeof values === 'string') {
      headers.set(name, values);
    } else {
      for (const value in values) {
        headers.set(name, value);
      }
    }
  }

  // @ts-expect-error
  return headers;
}

