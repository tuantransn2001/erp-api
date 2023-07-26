require("dotenv").config();
import { NextFunction, Request, Response } from "express";

import { handleValidateClientRequestBeforeModify } from "../common";
import { STATUS_CODE, STATUS_MESSAGE } from "../ts/enums/api_enums";
import RestFullAPI from "../utils/response/apiResponse";
import UserServices from "../services/user.services";
import { MODIFY_STATUS, USER_TYPE } from "../ts/enums/app_enums";
import HttpException from "../utils/exceptions/http.exception";
import StaffServices from "../services/staff.services";

class StaffController {
  public static async getAll(_: Request, res: Response, next: NextFunction) {
    try {
      const { statusCode, data } = await StaffServices.getAll({});
      res.status(statusCode).send(data);
    } catch (err) {
      next(err);
    }
  }
  public static async getByID(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const { statusCode, data } = await StaffServices.getByID({ id });

      res.status(statusCode).send(data);
    } catch (err) {
      next(err);
    }
  }
  public static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        user_phone,
        user_email,
        user_password,
        user_name,
        staff_gender,
        roles,
      } = req.body;

      const { status, message } = handleValidateClientRequestBeforeModify(
        {
          user_phone,
          user_email,
          user_password,
          user_name,
          staff_gender,
          roles,
        },
        [undefined]
      );

      switch (status) {
        case MODIFY_STATUS.ACCEPT: {
          const {
            isAllowViewImportNWholesalePrice,
            isAllowViewShippingPrice,
            staff_birthday,
            address_list,
            user_code,
          } = req.body;
          const { statusCode, data } = await StaffServices.create({
            user_phone,
            user_email,
            user_code,
            user_password,
            user_name,
            staff_gender,
            roles,
            isAllowViewImportNWholesalePrice,
            isAllowViewShippingPrice,
            staff_birthday,
            address_list,
          });
          res.status(statusCode).send(data);
          break;
        }
        case MODIFY_STATUS.DENY: {
          res.status(STATUS_CODE.STATUS_CODE_406).send(
            RestFullAPI.onFail(STATUS_MESSAGE.NOT_ACCEPTABLE, {
              message,
            } as HttpException)
          );
          break;
        }
      }
    } catch (err) {
      next(err);
    }
  }
  public static async updateByID(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const {
        user_code,
        user_name,
        user_phone,
        user_email,
        staff_birthday,
        staff_gender,
        staff_address_list,
        roles,
      } = req.body;

      const { statusCode, data } = await StaffServices.updateDetail({
        staff_id: id,
        user_code,
        user_name,
        user_phone,
        user_email,
        staff_birthday,
        staff_gender,
        staff_address_list,
        roles,
      });

      res.status(statusCode).send(data);
    } catch (err) {
      next(err);
    }
  }
  public static async deleteByID(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      const { statusCode, data } = await UserServices.delete({
        id,
        user_type: USER_TYPE.STAFF,
      });

      res.status(statusCode).send(data);
    } catch (err) {
      next(err);
    }
  }
}
export default StaffController;
