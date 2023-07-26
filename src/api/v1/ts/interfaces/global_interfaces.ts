import { Request } from "express";
<<<<<<< HEAD
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
=======
export interface MyRequest extends Request {
  currentUserID?: string;
}
>>>>>>> dev/api-v2
