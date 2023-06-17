import { NextFunction, Request, Response } from "express";
import db from "../models";
import { STATUS_CODE, STATUS_MESSAGE } from "../ts/enums/api_enums";
import RestFullAPI from "../utils/response/apiResponse";
const { Payment } = db;

class PaymentController {
  public static async getAll(_: Request, res: Response, next: NextFunction) {
    try {
      const paymentList = await Payment.findAll();

      res
        .status(STATUS_CODE.STATUS_CODE_200)
        .send(RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS, paymentList));
    } catch (err) {
      next(err);
    }
  }
}

export default PaymentController;
