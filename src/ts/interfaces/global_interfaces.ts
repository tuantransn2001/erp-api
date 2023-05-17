import { Request } from "express";
interface MyRequest extends Request {
  currentUserID?: string;
}

export { MyRequest };
