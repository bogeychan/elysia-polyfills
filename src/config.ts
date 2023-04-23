import { TBunServeOptions } from './elysia-bun-types';

export function ensureDefaults<T>(options: TBunServeOptions<T>) {
  if (typeof options.port === 'undefined') {
    options.port = process.env.PORT ?? '3000';
  }

  if (typeof options.port === 'string') {
    options.port = parseInt(options.port);
  }

  if (isNaN(options.port)) {
    throw new Error(`Invalid port "${options.port}"`);
  }

  if (!options.hostname) {
    options.hostname = '0.0.0.0';
  }

  return options as Required<TBunServeOptions<T> & { port: number }>;
}
