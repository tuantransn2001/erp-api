import { Request, Response, NextFunction } from "express";
import { isEmpty } from "../../v1/common";
import db from "../models";
import { STATUS_CODE, STATUS_MESSAGE } from "../../v1/ts/enums/api_enums";
import { CUSTOMER_ACTION } from "../../v1/ts/enums/app_enums";
import { ORDER_IMPORT_STATUS } from "../../v1/ts/enums/order_enum";
import RestFullAPI from "../utils/response/apiResponse";
const { Debt, Order } = db;
class DebtController {
  public static async pay(req: Request, res: Response, next: NextFunction) {
    try {
      const { user_id, source_id, debt_payment_amount } = req.query;
      // ? [ source_id ] is TARGET WHICH THIS DEBT PAID FOR
      const foundUserDebt = await Debt.findOne({
        where: { user_id, source_id },
        order: [["createdAt", "DESC"]],
      });

      // ? Update change debt amount -> 2 case [ "All - dot not allow" , "A part" ]
      const current_order_debt_amount_result =
        parseFloat(foundUserDebt.dataValues.debt_amount as string) +
        parseFloat(debt_payment_amount as string);

      if (current_order_debt_amount_result > 0) {
        // ? Case user paid more than debt
        // ! => Deny
        res.status(STATUS_CODE.STATUS_CODE_406).send(
          RestFullAPI.onSuccess(STATUS_MESSAGE.NOT_ACCEPTABLE, {
            message: `user paid: ${debt_payment_amount} more than current debt amount: ${foundUserDebt.dataValues.debt_amount}`,
          })
        );
      }

      if (current_order_debt_amount_result <= 0) {
        // ? Case user paid less then || equal debt
        // ? create new debt [ update ]
        // ? Update order_status

        const foundLastDebt = await Debt.findOne({
          where: {
            user_id,
          },
          order: [["createdAt", "DESC"]],
          attributes: ["debt_amount"],
        });

        const remaining_debt_amount_result =
          parseFloat(foundLastDebt.dataValues.debt_amount as string) +
          parseFloat(debt_payment_amount as string);

        await Debt.create({
          user_id,
          source_id,
          change_debt: debt_payment_amount,
          debt_amount: remaining_debt_amount_result,
          debt_note: "Thanh toán đơn hàng",
          action: CUSTOMER_ACTION.IMPORT,
        });

        const foundOrder = await Order.findOne({
          where: {
            id: source_id,
          },
          attributes: ["order_total"],
        });

        const remaining_order_value: number =
          foundOrder.dataValues.order_total -
          parseFloat(debt_payment_amount as string);
        await Order.update(
          {
            order_status: ORDER_IMPORT_STATUS.DONE,
            order_total: remaining_order_value,
          },
          {
            where: {
              id: source_id,
            },
          }
        );

        res.status(STATUS_CODE.STATUS_CODE_201).send(
          RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS, {
            updateUserDebt: await Debt.findAll({
              where: {
                user_id,
              },
            }),
            updateOrder: await Order.findOne({
              where: {
                id: source_id,
              },
            }),
          })
        );
      }
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
