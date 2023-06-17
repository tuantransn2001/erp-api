import { Request } from "express";
export interface MyRequest extends Request {
  currentUserID?: string;
}

export interface ObjectDynamicKeyWithValue {
  [props: string]: any;
}

export interface ObjectDynamicKeyWithValueIsString {
  [props: string]: string;
}
