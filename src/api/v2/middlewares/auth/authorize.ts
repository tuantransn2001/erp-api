import { Response, NextFunction } from "express";
import { MyRequest } from "@/src/api/v2/common/interfaces/common";
import db from "../../models";
import { STATUS_CODE, STATUS_MESSAGE } from "../../common/enums/api_enums";
import RestFullAPI from "../../utils/response/apiResponse";

export const authorize = async (
  req: MyRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorizeArr = ["admin"];
    const userID = req.currentUserID;
    const foundUser = await db.User.findByPk(userID);
    const isAdmin = authorizeArr.includes(foundUser.dataValues.user_type);
    if (isAdmin) {
      return next();
    } else {
      res
        .status(STATUS_CODE.NOT_ACCEPTABLE)
        .send(
          RestFullAPI.onSuccess(
            STATUS_MESSAGE.NOT_ACCEPTABLE,
            "You are not Admin!!"
          )
        );
    }
  } catch (err) {
    next(err);
  }
};
