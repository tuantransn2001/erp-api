import { ZodError } from "zod";
export type Falsy = false | 0 | "" | null | undefined;
export type ObjectType<T> = Record<string, T>;
export type JwtPayload = {
  id: string;
};
export type DynamicType<T> = T extends infer R ? R : never;
export type ServerError = ZodError | Error;
