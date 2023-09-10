require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import { MyRequest } from "@/src/api/v2/ts/interfaces/common";
import jwt from "jsonwebtoken";
import { STATUS_CODE, STATUS_MESSAGE } from "../../ts/enums/api_enums";
import RestFullAPI from "../../utils/response/apiResponse";
import { JwtPayload } from "../../ts/types/common";

export const authenticate = async (
  req: MyRequest & Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const JWT_TOKEN_SECRET_KEY: string = process.env
      .JWT_TOKEN_SECRET_KEY as string;

    const [_, access_token] = req.headers.authorization?.split(" ") as string[];

    const isAuth = jwt.verify(access_token, JWT_TOKEN_SECRET_KEY) as JwtPayload;
    if (isAuth) {
      req.currentUserID = isAuth.id;
      return next();
    } else {
      res
        .status(STATUS_CODE.UNAUTHORIZED)
        .send(
          RestFullAPI.onSuccess(
            STATUS_MESSAGE.UN_AUTHORIZE,
            "Client-Error && In-Valid Token"
          )
        );
    }
  } catch (err) {
    res
      .status(STATUS_CODE.UNAUTHORIZED)
      .send(
        RestFullAPI.onSuccess(
          STATUS_MESSAGE.UN_AUTHORIZE,
          "Client-Error && In-Valid Token"
        )
      );
  }
};
