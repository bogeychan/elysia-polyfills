import type {
  TBunServeOptions,
  TBunServer,
  TElysiaServer
} from '../elysia-bun-types.js';

const statusText = 'Internal Server Error';

export async function handleError<T>(
  options: TBunServeOptions<T>,
  server: TElysiaServer,
  error: any
) {
  if (options.error) {
    const response = await options.error.call(server as TBunServer, error);

    if (response) {
      return response;
    }
  }

  return new Response(statusText, { status: 500, statusText });
}
