import { Request, Response, NextFunction } from "express";
import {
  isEmpty,
  checkMissPropertyInObjectBaseOnValueCondition,
  handleFormatUpdateDataByValidValue,
} from "../common";
import { STATUS_CODE, STATUS_MESSAGE } from "../ts/enums/api_enums";
import {
  ORDER_IMPORT_STATUS,
  ORDER_SALE_STATUS,
  ORDER_TYPE,
} from "../ts/enums/order_enum";
import RestFullAPI from "../utils/response/apiResponse";

import db from "../models";
import OrderServices from "../services/order.services";
import CommonServices from "../services/common.services";
import DebtService from "../services/debt.services";
import { ObjectType } from "../ts/types/app_type";
const { Order, OrderProductList, OrderTag } = db;

class OrderController {
  public static getAll(order_type: ORDER_TYPE) {
    return async (_: Request, res: Response, next: NextFunction) => {
      try {
        const { statusCode, data } = await OrderServices.getAll(
          order_type as string
        );

        res.status(statusCode).send(data);
      } catch (err) {
        next(err);
      }
    };
  }
  public static async getByID(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, order_type } = req.query as ObjectType<string>;

      const { statusCode, data } = await OrderServices.getByID({
        id,
        order_type,
      });

      res.status(statusCode).send(data);
    } catch (err) {
      next(err);
    }
  }
  public static async updateDetailByID(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id: order_id } = req.params;
      const foundOrder = await Order.findOne({
        where: {
          id: order_id,
        },
      });
      const order_status = foundOrder.dataValues.order_status;
      // ? Check status => ...
      // * [ GENERATE , TRADING , DONE ]
      switch (order_status) {
        // * GENERATE -> Modify almost
        case ORDER_SALE_STATUS.GENERATE:
        case ORDER_IMPORT_STATUS.GENERATE: {
          const {
            custSupp_id,
            staff_id,
            order_delivery_date,
            order_note,
            products,
            tags,
          } = req.body;

          const argMissArr = checkMissPropertyInObjectBaseOnValueCondition(
            { custSupp_id, staff_id, products },
            [undefined]
          );

          const isAcceptUpdate = isEmpty(argMissArr) && !isEmpty(products);

          if (isAcceptUpdate) {
            const updateOrderTotal =
              OrderServices.calculateOrderTotal(products);

            const updateOrderRow = handleFormatUpdateDataByValidValue(
              {
                custSupp_id,
                staff_id,
                order_delivery_date,
                order_note,
                order_total: updateOrderTotal,
              },
              foundOrder.dataValues
            );

            const updateDetailResult = await OrderServices.updateDetail({
              queryCondition: { id: order_id },
              updateData: updateOrderRow,
            });

            const updateOrderProductListResult =
              await OrderServices.updateOrderProductList({
                queryCondition: { order_id },
                JunctionModel: OrderProductList,
                updateProductsData: products,
              });

            const updateTagResult = await CommonServices.updateJunctionRecord({
              JunctionModel: OrderTag,
              ownerQuery: {
                order_id,
              },
              attrs: tags?.map(({ tag_id }) => ({ tag_id })),
            });

            const { statusCode, response } =
              await RestFullAPI.onArrayPromiseSuccess([
                updateDetailResult,
                updateOrderProductListResult,
                updateTagResult,
              ]);

            res.status(statusCode).send(response);
          } else {
            const responseMessage =
              argMissArr.join(",") +
              " is required!" +
              " " +
              (isEmpty(products) && "products can't be empty!");

            res.status(STATUS_CODE.STATUS_CODE_406).send(
              RestFullAPI.onSuccess(STATUS_MESSAGE.NOT_ACCEPTABLE, {
                message: responseMessage,
              })
            );
          }

          break;
        }
        // * REST [TRADING,DONE] -> Modify tags , note
        // * => SALE
        case ORDER_SALE_STATUS.APPROVE:
        case ORDER_SALE_STATUS.PACKAGE:
        case ORDER_SALE_STATUS.DELIVERY:
        case ORDER_SALE_STATUS.DONE:
        // ? => IMPORT
        case ORDER_IMPORT_STATUS.DONE:
        case ORDER_IMPORT_STATUS.TRADING: {
          const { tags, order_note } = req.body;
          const updateOrderRow = handleFormatUpdateDataByValidValue(
            {
              order_note,
            },
            foundOrder.dataValues
          );

          const updateDetailResult = await OrderServices.updateDetail({
            queryCondition: { id: order_id },
            updateData: updateOrderRow,
          });

          const updateTagResult = await CommonServices.updateJunctionRecord({
            JunctionModel: OrderTag,
            ownerQuery: {
              order_id,
            },
            attrs: tags?.map(({ tag_id }) => ({ tag_id })),
          });

          const { statusCode, response } =
            await RestFullAPI.onArrayPromiseSuccess([
              updateDetailResult,
              updateTagResult,
            ]);

          res.status(statusCode).send(response);
        }
      }
    } catch (err) {
      next(err);
    }
  }
  public static async updateStatusByID(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id: order_id } = req.params;
      const { update_status } = req.body;

      const { statusCode, data } = await OrderServices.updateOrderStatus({
        order_id,
        update_status,
      });

      res.status(statusCode).send(data);
    } catch (err) {
      next(err);
    }
  }
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
  public static Import() {
    return class {
      public static async create(
        req: Request,
        res: Response,
        next: NextFunction
      ) {
        try {
          const {
            supplier_id,
            agency_branch_id,
            shipper_id,
            payment_id,
            staff_id,
            order_delivery_date,
            order_note,
            tags,
            products,
          } = req.body;

          const { statusCode, data } = await OrderServices.create({
            supplier_id,
            agency_branch_id,
            shipper_id,
            payment_id,
            staff_id,
            order_delivery_date,
            order_note,
            tags,
            products,
            order_type: ORDER_TYPE.IMPORT,
          });

          res.status(statusCode).send(data);
        } catch (err) {
          next(err);
        }
      }
    };
  }
  public static Sale() {
    return class {
      public static async create(
        req: Request,
        res: Response,
        next: NextFunction
      ) {
        try {
          const {
            supplier_id,
            agency_branch_id,
            shipper_id,
            payment_id,
            staff_id,
            order_delivery_date,
            order_note,
            tags,
            products,
          } = req.body;

          const { statusCode, data } = await OrderServices.create({
            supplier_id,
            agency_branch_id,
            shipper_id,
            payment_id,
            staff_id,
            order_delivery_date,
            order_note,
            tags,
            products,
            order_type: ORDER_TYPE.SALE,
          });

          res.status(statusCode).send(data);
        } catch (err) {
          next(err);
        }
      }
    };
  }
}

export default OrderController;
