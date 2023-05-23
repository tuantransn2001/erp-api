import { IncomingHttpHeaders } from "http2";
import { Response, NextFunction } from "express";
import { MyRequest } from "@/src/ts/interfaces/global_interfaces";
import jwt from "jsonwebtoken";
import { STATUS_CODE, STATUS_MESSAGE } from "../../ts/enums/api_enums";
import RestFullAPI from "../../utils/response/apiResponse";

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
      res
        .status(STATUS_CODE.STATUS_CODE_401)
        .send(
          RestFullAPI.onSuccess(
            STATUS_MESSAGE.UN_AUTHORIZE,
            "Client-Error && In-Valid Token"
          )
        );
    }
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res
        .status(STATUS_CODE.STATUS_CODE_401)
        .send(
          RestFullAPI.onSuccess(
            STATUS_MESSAGE.UN_AUTHORIZE,
            "Access Token was expired!"
          )
        );
    }
    if (err instanceof jwt.NotBeforeError) {
      res
        .status(STATUS_CODE.STATUS_CODE_401)
        .send(
          RestFullAPI.onSuccess(STATUS_MESSAGE.UN_AUTHORIZE, "jwt not active")
        );
    }
    if (err instanceof jwt.JsonWebTokenError) {
      res
        .status(STATUS_CODE.STATUS_CODE_401)
        .send(
          RestFullAPI.onSuccess(STATUS_MESSAGE.UN_AUTHORIZE, "jwt malformed")
        );
    }
  }
};
export default authenticate;