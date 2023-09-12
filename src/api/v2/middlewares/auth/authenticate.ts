require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import { MyRequest } from "@/src/api/v2/ts/interfaces/common";
import { STATUS_CODE, STATUS_MESSAGE } from "../../ts/enums/api_enums";
import RestFullAPI from "../../utils/response/apiResponse";
import { JwtServiceHelper } from "../../services/helpers/jwtServiceHelper/jwtServiceHelper";

export const AuthenticateMiddleware = async (
  req: MyRequest & Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const [_, access_token] = req.headers.authorization?.split(" ") as string[];

    const verifyRes = JwtServiceHelper.verifyToken(access_token);
    if (verifyRes) {
      req.currentUserID = verifyRes.id;
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
