type Elysia = import('elysia').Elysia;

declare module '@elysiajs/cors' {
  function cors(): Elysia;
}

declare module '@elysiajs/html' {
  function html(): Elysia;
}

declare module '@elysiajs/bearer' {
  function bearer(...args: any[]): Elysia;
}

declare module '@elysiajs/cookie' {
  function cookie(...agrs: any[]): Elysia;
}

declare module '@elysiajs/swagger' {
  function swagger(...args: any[]): Elysia;
}

declare module '@elysiajs/static' {
  function staticPlugin(...args: any[]): Elysia;
}
