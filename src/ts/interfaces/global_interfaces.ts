import { Request } from "express";
interface MyRequest extends Request {
  currentUserID?: string;
}

interface ObjectDynamicKeyWithValue {
  [props: string]: any;
}

interface ObjectDynamicKeyWithValueIsString {
  [props: string]: string;
}

export {
  MyRequest,
  ObjectDynamicKeyWithValueIsString,
  ObjectDynamicKeyWithValue,
};
