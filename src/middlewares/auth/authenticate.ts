require("dotenv").config();
import { IncomingHttpHeaders } from "http2";
import { Response, NextFunction } from "express";
import { MyRequest } from "@/src/ts/interfaces/global_interfaces";
import jwt from "jsonwebtoken";
import { STATUS_CODE, STATUS_MESSAGE } from "../../ts/enums/api_enums";
import RestFullAPI from "../../utils/response/apiResponse";

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
    res
      .status(STATUS_CODE.STATUS_CODE_401)
      .send(
        RestFullAPI.onSuccess(
          STATUS_MESSAGE.UN_AUTHORIZE,
          "Client-Error && In-Valid Token"
        )
      );
  }
};
export default authenticate;
