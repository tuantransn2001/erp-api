import { IncomingHttpHeaders } from "http2";
import { Response, NextFunction } from "express";
import { MyRequest } from "@/src/ts/interfaces/global_interfaces";
import jwt from "jsonwebtoken";

require("dotenv").config();

interface MyCustomsHeaders {
  token: string;
}
type IncomingCustomHeaders = IncomingHttpHeaders & MyCustomsHeaders;

const authenticate = async (
  req: MyRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const JWT_TOKEN_SECRET_KEY: string = process.env
      .JWT_TOKEN_SECRET_KEY as string;
    const { token } = req.headers as IncomingCustomHeaders;
    interface JwtPayload {
      id: string;
    }
    const isAuth = jwt.verify(token, JWT_TOKEN_SECRET_KEY) as JwtPayload;
    if (isAuth) {
      req.currentUserID = isAuth.id;
      return next();
    } else {
      res.status(401).send({
        status: "Unauthorised",
        message: "Client-Error && In-Valid Token",
      });
    }
  } catch (err) {
    res.status(500).send({
      status: "Fail",
      message: "You are not logged in!",
    });
  }
};
export default authenticate;
