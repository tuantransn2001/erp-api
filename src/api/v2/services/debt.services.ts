import db from "../models";
import { CreateDebtRowDTO } from "../dto/input/debt/debt.interface";

import { STATUS_CODE, STATUS_MESSAGE } from "../ts/enums/api_enums";
import { CUSTSUPP_ACTION } from "../ts/enums/app_enums";
import { ObjectType, ServerError } from "../ts/types/common";
import HttpException from "../utils/exceptions/http.exception";
import { handleError } from "../utils/handleError/handleError";
import RestFullAPI from "../utils/response/apiResponse";
import { handleServerResponse } from "../utils/response/handleServerResponse";
import { BaseModelHelper } from "./helpers/baseModelHelper/baseModelHelper";
import {
  CreateAsyncPayload,
  GetByIdAsyncPayload,
  UpdateAsyncPayload,
} from "./helpers/baseModelHelper/shared/baseModelHelper.interface";
const { Debt, Order } = db;

type DebtPayPayload = {
  user_id: string;
  source_id: string;
  debt_payment_amount: string;
};

type GetDebtTotalPayload = {
  user_id: string;
};

class DebtService {
  public static async pay({
    user_id,
    source_id,
    debt_payment_amount,
  }: DebtPayPayload) {
    try {
      {
        // ? [ source_id ] is TARGET WHICH THIS DEBT PAID FOR
        const getUserDebtData: GetByIdAsyncPayload = {
          Model: Debt,
          where: { user_id, source_id },
          order: [["createdAt", "DESC"]],
        };

        const { data: foundUserDebt } = await BaseModelHelper.getOneAsync(
          getUserDebtData
        );

        // ? Update change debt amount -> 2 case [ "All - dot not allow" , "A part" ]
        const current_order_debt_amount_result =
          parseFloat(foundUserDebt.dataValues.debt_amount as string) +
          parseFloat(debt_payment_amount as string);

        const shouldDenyPayment = current_order_debt_amount_result > 0;
        // ? Case user paid more than debt
        // ! => Deny

        if (shouldDenyPayment) {
          return handleServerResponse(
            STATUS_CODE.NOT_ACCEPTABLE,
            RestFullAPI.onFail(STATUS_MESSAGE.NOT_ACCEPTABLE, {
              message: `user paid: ${debt_payment_amount} more than current debt amount: ${foundUserDebt.dataValues.debt_amount}`,
            } as HttpException)
          );
        } else {
          // ? current_order_debt_amount_result <= 0
          // ? Case user paid less then || equal debt
          // ? create new debt [ update ]
          // ? Update order_status

          const getUserLastDebt: GetByIdAsyncPayload = {
            Model: Debt,
            where: {
              user_id,
            },
            order: [["createdAt", "DESC"]],
            attributes: ["debt_amount"],
          };

          const { data: userLastDebt } = await BaseModelHelper.getOneAsync(
            getUserLastDebt
          );

          const remaining_debt_amount_result =
            parseFloat(userLastDebt.data.dataValues.debt_amount as string) +
            parseFloat(debt_payment_amount as string);

          const createDebtData: CreateAsyncPayload<CreateDebtRowDTO> = {
            Model: Debt,
            dto: {
              user_id,
              source_id,
              change_debt: debt_payment_amount,
              debt_amount: `${remaining_debt_amount_result}`,
              debt_note: "Thanh toán đơn hàng",
              action: CUSTSUPP_ACTION.IMPORT,
            },
          };

          await BaseModelHelper.createAsync(createDebtData);

          const getOrderByIdData: GetByIdAsyncPayload = {
            Model: Order,
            where: {
              id: source_id,
            },
            attributes: ["order_total"],
          };

          const { data: foundOrder } = await BaseModelHelper.getOneAsync(
            getOrderByIdData
          );

          const remaining_order_value: number =
            foundOrder.data.dataValues.order_total -
            parseFloat(debt_payment_amount as string);

          const updateOrderData: UpdateAsyncPayload<ObjectType<number>> = {
            Model: Order,
            dto: { order_total: remaining_order_value },
            where: { id: source_id },
          };

          await BaseModelHelper.updateAsync(updateOrderData);

          // TODO: handle update order on success

          return handleServerResponse(
            STATUS_CODE.ACCEPTED,
            RestFullAPI.onSuccess(STATUS_MESSAGE.ACCEPTED)
          );
        }
      }
    } catch (err) {
      return handleServerResponse(
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        handleError(err as ServerError)
      );
    }
  }
  public static async getTotal({ user_id }: GetDebtTotalPayload) {
    const getDebtAmountData: GetByIdAsyncPayload = {
      Model: Debt,
      where: {
        user_id,
      },
      attributes: ["id", "debt_amount", "createdAt", "updatedAt"],
      order: [["createdAt", "DESC"]],
    };

    const { statusCode, data } = await BaseModelHelper.getOneAsync(
      getDebtAmountData
    );

    return handleServerResponse(statusCode, data);
  }
}

export default DebtService;
