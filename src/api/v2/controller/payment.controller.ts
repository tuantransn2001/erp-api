import { NextFunction, Request, Response } from "express";
import db from "../models";
import { BaseModelHelper } from "../services/helpers/baseModelHelper";
import { GetAllAsyncPayload } from "../services/helpers/shared/baseModelHelper.interface";
const { Payment } = db;

class PaymentController {
  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const getTypeAllData: GetAllAsyncPayload = {
        ...BaseModelHelper.getPagination(req),
        Model: Payment,
      };

      const { statusCode, data } = await BaseModelHelper.getAllAsync(
        getTypeAllData
      );

      res.status(statusCode).send(data);
    } catch (err) {
      next(err);
    }
  }
}

export default PaymentController;
