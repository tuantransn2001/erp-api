import { IncomingHttpHeaders } from "http2";

export type Falsy = false | 0 | "" | null | undefined;
export type ObjectType = Record<string, any>;

export type IncomingCustomHeaders = IncomingHttpHeaders & {
  token: string;
};

export type JwtPayload = {
  id: string;
};
