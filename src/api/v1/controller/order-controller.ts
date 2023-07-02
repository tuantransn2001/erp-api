import { Request, Response, NextFunction } from "express";
import {
  isEmpty,
  checkMissPropertyInObjectBaseOnValueCondition,
  handleFormatUpdateDataByValidValue,
  removeItem,
} from "../../v1/common";
import { STATUS_CODE, STATUS_MESSAGE } from "../../v1/ts/enums/api_enums";
import {
  ORDER_IMPORT_STATUS,
  ORDER_SALE_STATUS,
  ORDER_TYPE,
} from "../../v1/ts/enums/order_enum";
import RestFullAPI from "../utils/response/apiResponse";

import db from "../models";
import OrderServices from "../services/order.services";
import CommonServices from "../services/common.services";
import { ObjectType } from "../ts/types/app_type";
import DebtService from "../services/debt.services";
const { Order, OrderProductList, OrderTag, Customer, User } = db;

const ORDER_SALE_STATUS_VALUES: string[] = removeItem(
  Object.values(ORDER_SALE_STATUS),
  ORDER_SALE_STATUS.DONE
);
const ORDER_IMPORT_STATUS_VALUES: string[] = removeItem(
  Object.values(ORDER_IMPORT_STATUS),
  ORDER_IMPORT_STATUS.DONE
);

class OrderController {
  public static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { order_type } = req.query;

      const { statusCode, data } = await OrderServices.getAll(
        order_type as string
      );

      res.status(statusCode).send(data);
    } catch (err) {
      next(err);
    }
  }
  public static async getByID(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, order_type }: ObjectType = req.query;

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
        include: [
          {
            model: OrderProductList,
          },
        ],
      });

      const order_status = foundOrder.dataValues.order_status;
      // ? Check status => ...
      // * [ GENERATE , TRADING , DONE ]
      switch (order_status) {
        // * GENERATE -> Modify almost
        case ORDER_SALE_STATUS.GENERATE:
        case ORDER_IMPORT_STATUS.GENERATE: {
          const {
            supplier_id,
            staff_id,
            order_delivery_date,
            order_note,
            products,
            tags,
          } = req.body;

          const argMissArr = checkMissPropertyInObjectBaseOnValueCondition(
            { supplier_id, staff_id, products },
            undefined
          );

          const isAcceptUpdate = isEmpty(argMissArr) && !isEmpty(products);

          if (isAcceptUpdate) {
            const updateOrderTotal =
              OrderServices.calculateOrderTotal(products);

            const updateOrderRow = handleFormatUpdateDataByValidValue(
              {
                supplier_id,
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

            const updateTagResult =
              CommonServices.isAcceptUpdateTag(tags) &&
              (await CommonServices.updateTags({
                TagJunctionModel: OrderTag,
                queryCondition: {
                  order_id,
                },
                updateTags: tags,
              }));

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

          const updateTagResult =
            CommonServices.isAcceptUpdateTag(tags) &&
            (await CommonServices.updateTags({
              TagJunctionModel: OrderTag,
              queryCondition: {
                order_id,
              },
              updateTags: tags,
            }));

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

      const foundOrder = await Order.findOne({
        where: { id: order_id },
        include: [
          {
            model: Customer,
            attributes: ["id", "user_id"],
            include: [
              {
                model: User,
                attributes: ["id"],
              },
            ],
          },
        ],
      });

      const _order_type = foundOrder.dataValues.order_type;
      const user_id =
        foundOrder.dataValues.Customer.dataValues.User.dataValues.id;
      const checkAcceptUpdate = () => {
        let isOK: boolean = false;
        let messages: string[] = [];

        const IN_VALID_STATUS_LIST = new Set([
          ORDER_IMPORT_STATUS.DONE,
          ORDER_SALE_STATUS.DONE,
        ]);

        const VALID_STATUS_LIST =
          _order_type === ORDER_TYPE.SALE
            ? new Set(ORDER_SALE_STATUS_VALUES)
            : new Set(ORDER_IMPORT_STATUS_VALUES);

        const argMissArr = checkMissPropertyInObjectBaseOnValueCondition(
          { update_status },
          undefined
        );

        isOK =
          isEmpty(argMissArr) &&
          !IN_VALID_STATUS_LIST.has(update_status) &&
          VALID_STATUS_LIST.has(update_status);
        if (!isEmpty(argMissArr)) {
          messages.push(`${argMissArr.join(",")} is required!`);
        }

        if (IN_VALID_STATUS_LIST.has(update_status)) {
          messages.push(
            `update order status value cann't be: ${Array.from(
              IN_VALID_STATUS_LIST
            )}`
          );
        }

        if (!VALID_STATUS_LIST.has(update_status)) {
          messages.push(
            `update order status value must be: ${Array.from(
              VALID_STATUS_LIST
            ).join(",")}`
          );
        }
        return {
          isOK,
          messages,
        };
      };

      if (checkAcceptUpdate().isOK) {
        // ? check order_status - order_status must be [ cancel , trading , return ]

        const current_status = foundOrder.dataValues.order_status;

        switch (current_status) {
          // ? Accept update
          case ORDER_SALE_STATUS.GENERATE:
          case ORDER_SALE_STATUS.APPROVE:
          case ORDER_SALE_STATUS.PACKAGE:
          case ORDER_SALE_STATUS.DELIVERY:
          case ORDER_IMPORT_STATUS.GENERATE:
          case ORDER_IMPORT_STATUS.TRADING: {
            foundOrder.order_status = update_status;
            await foundOrder.save();

            await OrderServices.updateOrderOnSuccess({
              user_id,
              order_id,
            });

            res
              .status(STATUS_CODE.STATUS_CODE_201)
              .send(RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS));
            break;
          }
          // ? Case return
          case ORDER_SALE_STATUS.CANCEL:
          case ORDER_SALE_STATUS.RETURN:
          case ORDER_IMPORT_STATUS.CANCEL:
          case ORDER_IMPORT_STATUS.RETURN: {
            res
              .status(STATUS_CODE.STATUS_CODE_503)
              .send(
                RestFullAPI.onSuccess(
                  STATUS_MESSAGE.SERVICES_UNAVAILABLE,
                  "In development state... Will complete later"
                )
              );
            break;
          }
          // ! Deny update
          default: {
            res
              .status(STATUS_CODE.STATUS_CODE_406)
              .send(
                RestFullAPI.onSuccess(
                  STATUS_MESSAGE.NOT_ACCEPTABLE,
                  `order_status: '${update_status}' in-valid! - Example: ${ORDER_SALE_STATUS} , ${ORDER_IMPORT_STATUS}`
                )
              );
          }
        }
      } else {
        res
          .status(STATUS_CODE.STATUS_CODE_406)
          .send(
            RestFullAPI.onSuccess(
              STATUS_MESSAGE.NOT_ACCEPTABLE,
              checkAcceptUpdate().messages
            )
          );
      }
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

      await OrderServices.updateOrderOnSuccess({
        user_id: req.query.user_id as string,
        order_id: req.query.source_id as string,
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
