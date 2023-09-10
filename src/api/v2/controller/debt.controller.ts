import { Request, Response, NextFunction } from "express";
import db from "../models";
import DebtService from "../services/debt.services";
import { BaseModelHelper } from "../services/helpers/baseModelHelper";
import { GetAllAsyncPayload } from "../services/helpers/shared/baseModelHelper.interface";
const { Debt } = db;
class DebtController {
  public async getAllChangeByUserID(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const getAllUserDebtChangesData: GetAllAsyncPayload = {
        ...BaseModelHelper.getPagination(req),
        Model: Debt,
        where: {
          user_id: req.params.id,
        },
        order: [["createdAt", "DESC"]],
        attributes: [
          "id",
          "debt_amount",
          "change_debt",
          "action",
          "debt_note",
          "createdAt",
          "updatedAt",
        ],
      };

      const { statusCode, data } = await BaseModelHelper.getAllAsync(
        getAllUserDebtChangesData
      );

      res.status(statusCode).send(data);
    } catch (err) {
      next(err);
    }
  }
  public async getDebtAmount(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: user_id } = req.params;

      const { statusCode, data } = await DebtService.getTotal({ user_id });

      res.status(statusCode).send(data);
    } catch (err) {
      next(err);
    }
  }
}

export default DebtController;
