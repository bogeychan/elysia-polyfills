import { TBunServeOptions, TBunTLSServeOptions } from './elysia-bun-types.js';

type ValidOptions<T> = Required<TBunServeOptions<T>> & {
  port: number;
  key?: string;
  cert?: string;
};

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

  const { key, cert } = options as TBunTLSServeOptions;
  if (typeof key !== 'undefined' && typeof cert !== 'undefined') {
    if (typeof key !== 'string' || typeof cert !== 'string') {
      throw new Error(
        `Key and Cert are only supported in "string" (i.e. PEM) format`
      );
    }
  }

  return options as ValidOptions<T>;
}

