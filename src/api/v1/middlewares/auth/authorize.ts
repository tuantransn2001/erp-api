import { Response, NextFunction } from "express";
import { MyRequest } from "@/src/api/v1/ts/interfaces/global_interfaces";
import db from "../../models";
import { STATUS_CODE, STATUS_MESSAGE } from "../../ts/enums/api_enums";
import RestFullAPI from "../../utils/response/apiResponse";

const authorize = async (req: MyRequest, res: Response, next: NextFunction) => {
  try {
    const authorizeArr = ["admin"];
    const userID = req.currentUserID;
    const foundUser = await db.User.findByPk(userID);
    const isAdmin = authorizeArr.includes(foundUser.dataValues.user_type);
    if (isAdmin) {
      return next();
    } else {
      res
        .status(STATUS_CODE.STATUS_CODE_406)
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

export default authorize;
