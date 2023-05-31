/// <reference types="@types/node" />

import type http from 'node:http';

export async function response(
  response: Response,
  httpResponse: http.ServerResponse<http.IncomingMessage> & {
    req: http.IncomingMessage;
  }
) {
  httpResponse.statusCode = response.status;
  httpResponse.statusMessage = response.statusText;

  for (const [name, value] of response.headers) {
    httpResponse.setHeader(name, value);
  }

  await response.body?.pipeTo(
    new WritableStream({
      //! make sure to end the response in outer scope!!!
      write(chunk: Buffer) {
        httpResponse.write(chunk);
      }
    })
  );
}

