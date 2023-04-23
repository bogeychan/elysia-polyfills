import type {
  ServeOptions,
  Server,
  TLSServeOptions,
  TLSWebSocketServeOptions,
  WebSocketServeOptions
} from 'bun';

type TElysiaBun = Pick<typeof import('bun'), 'serve' | 'gc'>;
type TElysiaServer = Omit<Server, 'publish' | 'reload' | 'upgrade'>;

type TBunServer = Server;
type TBunServeOptions<T> =
  | ServeOptions
  | TLSServeOptions
  | WebSocketServeOptions<T>
  | TLSWebSocketServeOptions<T>;
type TBunRequest = Request;

export type {
  TElysiaBun,
  TElysiaServer,
  TBunServer,
  TBunServeOptions,
  TBunRequest
};
