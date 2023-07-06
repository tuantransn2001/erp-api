import { IncomingHttpHeaders } from "http2";
import { ENTITIES_FORMAT_TYPE } from "../enums/app_enums";

export type Falsy = false | 0 | "" | null | undefined;
export type ObjectType = Record<string, any>;
export type IncomingCustomHeaders = IncomingHttpHeaders & {
  token: string;
};
export type JwtPayload = {
  id: string;
};
export type GetEntitiesFormatPayload = {
  format_type: `${ENTITIES_FORMAT_TYPE}`;
};
export type GetByIdPayload = {
  id: string;
};

export type DynamicType<T> = T extends infer R ? R : never;
