import { Request } from "express";
export interface MyRequest extends Request {
  currentUserID?: string;
}
