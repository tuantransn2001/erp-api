import { NextFunction, Request, Response } from "express";
import CustSuppServices from "../services/custSupp.services";
import UserServices from "../services/user.services";
import { USER_TYPE } from "../ts/enums/app_enums";

interface CreatePayload {
  user_type: string;
}

class CustSuppController {
  public static getAll({ user_type }) {
    return (_: Request, res: Response, next: NextFunction) => {
      try {
        (async () => {
          const { statusCode, data } = await CustSuppServices.getAll({
            user_type,
          });

          res.status(statusCode).send(data);
        })();
      } catch (err) {
        next(err);
      }
    };
  }
  public static async getByID(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const { statusCode, data } = await CustSuppServices.getByID({ id });

      res.status(statusCode).send(data);
    } catch (err) {
      next(err);
    }
  }
  public static create({ user_type }: CreatePayload) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        (async () => {
          const {
            user_name,
            user_code,
            user_phone,
            user_email,
            address_list,
            staff_id,
            staff_in_charge_note,
            tags,
          } = req.body;

          const { statusCode, data } = await CustSuppServices.create({
            user_name,
            user_code,
            user_phone,
            user_email,
            address_list,
            staff_id,
            staff_in_charge_note,
            tags,
            user_type,
          });

          res.status(statusCode).send(data);
        })();
      } catch (err) {
        next(err);
      }
    };
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
        user_type: USER_TYPE.CUSTOMER,
      });

      res.status(statusCode).send(data);
    } catch (err) {
      next(err);
    }
  }
  public static async updatePersonalInfoByID(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const {
        user_code,
        user_name,
        user_phone,
        user_email,
        status,
        staff_id,
        staff_in_charge_note,
        tags,
      } = req.body;

      const { id } = req.params;

      const { statusCode, data } = await CustSuppServices.updateDetail({
        custSupp_id: id,
        user_code,
        user_name,
        user_phone,
        user_email,
        status,
        staff_id,
        staff_in_charge_note,
        tags,
      });

      res.status(statusCode).send(data);
    } catch (err) {
      next(err);
    }
  }
}

export default CustSuppController;
