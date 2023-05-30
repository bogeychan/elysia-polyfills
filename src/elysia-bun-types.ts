import type {
  ServeOptions,
  Server,
  TLSServeOptions,
  TLSWebSocketServeOptions,
  WebSocketServeOptions
} from 'bun';

type TElysiaBun = Pick<typeof import('bun'), 'serve' | 'gc' | 'file'>;
type TElysiaServer = Omit<Server, 'publish' | 'reload' | 'upgrade'>;
type TBunHeaders = Headers;

type TBunServer = Server;
type TBunServeOptions<T> =
  | ServeOptions
  | TLSServeOptions
  | WebSocketServeOptions<T>
  | TLSWebSocketServeOptions<T>;
type TBunRequest = Request;
type TBunFileBlob = ReturnType<TElysiaBun['file']>;

export type {
  TElysiaBun,
  TElysiaServer,
  TBunServer,
  TBunFileBlob,
  TBunServeOptions,
  TBunRequest,
  TBunHeaders
};

