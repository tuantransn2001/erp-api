import { Request, Response, NextFunction } from "express";
import db from "../../models";
import { UserAttributes } from "../../ts/interfaces/app_interfaces";
import { STATUS_CODE, STATUS_MESSAGE } from "../../ts/enums/api_enums";
import RestFullAPI from "../../utils/response/apiResponse";
import { isEmpty } from "../../common";
const { User } = db;
const checkUserExist =
  () => async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user_code, user_name, user_phone, user_email }: UserAttributes =
        req.body;

      const errorMessage: Array<string> = new Array();
      // * ================= Name =============
      if (user_name)
        await User.findOne({
          where: {
            user_name,
          },
        }).then((res: any) => {
          if (res)
            errorMessage.push(
              `Customer with name is ${res.dataValues.user_name} has been already exist`
            );
        });
      // * ================= Code =============
      if (user_code)
        await User.findOne({
          where: {
            user_code,
          },
        }).then((res: any) => {
          if (res)
            errorMessage.push(
              `Customer with code is ${res.dataValues.user_code} has been already exist`
            );
        });
      // * ================= Phone =============
      if (user_phone)
        await User.findOne({
          where: {
            user_phone,
          },
        }).then((res: any) => {
          if (res)
            errorMessage.push(
              `Customer with phone is ${res.dataValues.user_phone} has been already exist`
            );
        });
      // * ================= Email =============

      if (user_email)
        await User.findOne({
          where: {
            user_email,
          },
        }).then((res: any) => {
          if (res)
            errorMessage.push(
              `Customer with email is ${res.dataValues.user_email} has been already exist`
            );
        });

      if (!isEmpty(errorMessage)) {
        res
          .status(STATUS_CODE.STATUS_CODE_406)
          .send(
            RestFullAPI.onSuccess(STATUS_MESSAGE.NOT_ACCEPTABLE, errorMessage)
          );
      } else {
        return next();
      }
    } catch (err) {
      next(err);
    }
  };

export default checkUserExist;
