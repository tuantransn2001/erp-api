import db from "../models";
import { STATUS_CODE, STATUS_MESSAGE } from "../ts/enums/api_enums";
import { CUSTSUPP_ACTION } from "../ts/enums/app_enums";
import HttpException from "../utils/exceptions/http.exception";
import { handleError } from "../utils/handleError/handleError";
import RestFullAPI from "../utils/response/apiResponse";
import OrderServices from "./order.services";
const { Debt, Order } = db;

type DebtPayPayload = {
  user_id: string;
  source_id: string;
  debt_payment_amount: string;
};

type DebtGetTotalPayload = { user_id: string };

class DebtService {
  public static async pay({
    user_id,
    source_id,
    debt_payment_amount,
  }: DebtPayPayload) {
    try {
      {
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
          return {
            statusCode: STATUS_CODE.STATUS_CODE_406,
            data: RestFullAPI.onFail(STATUS_MESSAGE.NOT_ACCEPTABLE, {
              message: `user paid: ${debt_payment_amount} more than current debt amount: ${foundUserDebt.dataValues.debt_amount}`,
            } as HttpException),
          };
        } else {
          // ? current_order_debt_amount_result <= 0
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
            action: CUSTSUPP_ACTION.IMPORT,
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
              order_total: remaining_order_value,
            },
            {
              where: {
                id: source_id,
              },
            }
          );
          await OrderServices.updateOrderOnSuccess({
            user_id,
            order_id: source_id,
          });

          return {
            statusCode: STATUS_CODE.STATUS_CODE_200,
            data: RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS),
          };
        }
      }
    } catch (err) {
      return {
        statusCode: STATUS_CODE.STATUS_CODE_500,
        data: handleError(err as Error),
      };
    }
  }
  public static async getTotal({ user_id }: DebtGetTotalPayload) {
    try {
      const foundDebt = await Debt.findOne({
        where: {
          user_id,
        },
        attributes: ["id", "debt_amount", "createdAt", "updatedAt"],
        order: [["createdAt", "DESC"]],
      });

      const { id, debt_amount, createdAt, updatedAt } = foundDebt.dataValues;

      return {
        statusCode: STATUS_CODE.STATUS_CODE_200,
        data: RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS, {
          id,
          debt_amount,
          createdAt,
          updatedAt,
        }),
      };
    } catch (err) {
      return {
        statusCode: STATUS_CODE.STATUS_CODE_500,
        data: handleError(err as Error),
      };
    }
  }
}

export default DebtService;
