import { v4 as uuiv4 } from "uuid";
import { Request, Response, NextFunction } from "express";
import {
  checkMissPropertyInObjectBaseOnValueCondition,
  randomStringByCharsetAndLength,
} from "../common";
import { STATUS_CODE, STATUS_MESSAGE } from "../ts/enums/api_enums";
import { ORDER_IMPORT_STATUS, ORDER_TYPE } from "../ts/enums/order_enum";
import { CUSTOMER_ACTION } from "../ts/enums/app_enums";
import RestFullAPI from "../utils/response/apiResponse";
import {
  DebtAttributes,
  OrderAttributes,
  OrderProductListAttributes,
  OrderTagAttributes,
} from "../ts/interfaces/app_interfaces";
import db from "../models";
const { Customer, User, Order, OrderProductList, OrderTag, Debt } = db;

class OrderController {
  public static async checkValidOrderDataInputBeforeModify(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const {
        owner_id,
        staff_id,
        agency_branch_id,
        products,
        shipper_id,
        payment_id,
      } = req.body;

      const arrMissArray = checkMissPropertyInObjectBaseOnValueCondition(
        {
          owner_id,
          staff_id,
          agency_branch_id,
          products,
          shipper_id,
          payment_id,
        },
        undefined
      );

      if (arrMissArray.length === 0) {
        next();
      } else {
        res
          .status(STATUS_CODE.STATUS_CODE_406)
          .send(
            RestFullAPI.onSuccess(
              STATUS_MESSAGE.NOT_ACCEPTABLE,
              `${arrMissArray.join(",")} is require!`
            )
          );
      }
    } catch (err) {
      next(err);
    }
  }

  public static Import() {
    return class OrderImportController {
      public static async create(
        req: Request,
        res: Response,
        next: NextFunction
      ) {
        try {
          const {
            owner_id,
            agency_branch_id,
            shipper_id,
            payment_id,
            staff_id,
            order_delivery_date,
            order_note,
            tags,
            products,
          } = req.body;
          // ? ===== Generate order
          const orderRow: OrderAttributes = {
            id: uuiv4(),
            agency_branch_id,
            shipper_id,
            payment_id,
            staff_id,
            owner_id,
            order_code: randomStringByCharsetAndLength(
              "alphabet",
              5,
              "uppercase"
            ),
            order_delivery_date,
            order_note,
            order_type: ORDER_TYPE.IMPORT,
            order_status: ORDER_IMPORT_STATUS.GENERATE,
          };
          // ? ===== Generate order tag
          const orderTagRowArr: Array<OrderTagAttributes> = tags.map(
            (tagID: string) => ({ order_id: orderRow.id, tag_id: tagID })
          );

          // ? ===== Generate product list
          const orderProductRowArr: Array<OrderProductListAttributes> =
            products.map(
              ({
                product_variant_id,
                amount: product_amount,
                price: product_price,
                discount: product_discount,
                unit: product_unit,
              }: {
                [key: string]: string | number;
              }) => ({
                order_id: orderRow.id,
                product_variant_id,
                product_amount,
                product_price,
                product_discount,
                product_unit,
              })
            );

          // ? ===== Generate debt
          const totalDebt: number = orderProductRowArr.reduce(
            (total: number, product: any) => {
              total +=
                (product.product_amount *
                  product.product_price *
                  (100 - product.product_discount)) /
                100;

              return total;
            },
            0
          );

          const foundOrderOwner = await Customer.findOne({
            where: {
              id: owner_id,
            },
            attributes: [],
            include: [
              {
                model: User,
                where: {
                  isDelete: null,
                },
                attributes: ["id"],
              },
            ],
          });
          const userID: string = foundOrderOwner.dataValues.User.dataValues.id;
          const userDebtRow: DebtAttributes = {
            id: uuiv4(),
            user_id: userID,
            debt_amount: totalDebt,
            change_debt: totalDebt,
            debt_note: "Những lưu ý về công nợ sẽ được lưu ở đây!",
            action: CUSTOMER_ACTION.ORDER_PAYMENT,
          };

          // ? INSERT
          await Order.create(orderRow);
          await OrderTag.bulkCreate(orderTagRowArr);
          await OrderProductList.bulkCreate(orderProductRowArr);
          await Debt.create(userDebtRow);

          res
            .status(STATUS_CODE.STATUS_CODE_201)
            .send(RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS));
        } catch (err) {
          next(err);
        }
      }
    };
  }
}

export default OrderController;
