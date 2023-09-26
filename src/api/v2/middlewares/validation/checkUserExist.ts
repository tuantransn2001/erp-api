import { Request, Response, NextFunction } from "express";
import db from "../../models";
import { STATUS_CODE, STATUS_MESSAGE } from "../../ts/enums/api_enums";
import RestFullAPI from "../../utils/response/apiResponse";
import { isEmpty } from "../../common";
import { IUser } from "../../dto/input/user/user.interface";
import HttpException from "../../utils/exceptions/http.exception";
const { User } = db;
export const CheckUserExistMiddleware =
  () => async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user_code, user_name, user_phone, user_email }: IUser = req.body;

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
              `User with name is ${res.dataValues.user_name} has been already exist`
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
              `User with code is ${res.dataValues.user_code} has been already exist`
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
              `User with phone is ${res.dataValues.user_phone} has been already exist`
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
              `User with email is ${res.dataValues.user_email} has been already exist`
            );
        });

      if (!isEmpty(errorMessage)) {
        res.status(STATUS_CODE.CONFLICT).send(
          RestFullAPI.onFail(STATUS_MESSAGE.CONFLICT, {
            message: errorMessage.join(","),
          } as HttpException)
        );
      } else {
        next();
      }
    } catch (err) {
      next(err);
    }
  };
