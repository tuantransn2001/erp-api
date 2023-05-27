import { Request } from "express";
interface MyRequest extends Request {
  currentUserID?: string;
}

interface ObjectDynamicKeyWithValueIsString {
  [props: string]: string;
}

export { MyRequest, ObjectDynamicKeyWithValueIsString };
