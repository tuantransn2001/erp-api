import { Request, Response, NextFunction } from "express";
import { isEmpty } from "../../v1/common";
import db from "../models";
import { STATUS_CODE, STATUS_MESSAGE } from "../../v1/ts/enums/api_enums";
import RestFullAPI from "../utils/response/apiResponse";
import DebtService from "../services/debt.services";
const { Debt } = db;
class DebtController {
  public static async pay(req: Request, res: Response, next: NextFunction) {
    try {
      const { statusCode, data } = await DebtService.pay({
        user_id: req.query.user_id as string,
        source_id: req.query.source_id as string,
        debt_payment_amount: req.query.debt_payment_amount as string,
      });

      res.status(statusCode).send(data);
    } catch (err) {
      next(err);
    }
  }
  public static async getAllChangeByUserID(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id: user_id } = req.params;

      const debtsChangeLogs = await Debt.findAll({
        where: {
          user_id,
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
      });

      if (isEmpty(debtsChangeLogs)) {
        res.status(STATUS_CODE.STATUS_CODE_404).send(
          RestFullAPI.onSuccess(STATUS_MESSAGE.NOT_FOUND, {
            message: `This user with id: ${user_id} has no debt until now`,
          })
        );
      } else {
        res
          .status(STATUS_CODE.STATUS_CODE_200)
          .send(RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS, debtsChangeLogs));
      }
    } catch (err) {
      next(err);
    }
  }
}

export default DebtController;
