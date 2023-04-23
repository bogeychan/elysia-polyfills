if (!globalThis.process) {
  // @ts-ignore
  globalThis.process = { env: {} };
}

export * from './server';

