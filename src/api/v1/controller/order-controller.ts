import { Request, Response, NextFunction } from "express";
import {
  isEmpty,
  checkMissPropertyInObjectBaseOnValueCondition,
  handleFormatUpdateDataByValidValue,
} from "../../v1/common";
import { STATUS_CODE, STATUS_MESSAGE } from "../../v1/ts/enums/api_enums";
import { ORDER_IMPORT_STATUS, ORDER_TYPE } from "../../v1/ts/enums/order_enum";
import RestFullAPI from "../utils/response/apiResponse";
import {
  AgencyBranchProductListAttributes,
  OrderProductListAttributes,
  OrderTagAttributes,
} from "../../v1/ts/interfaces/app_interfaces";
import db from "../models";
import { ObjectDynamicKeyWithValue } from "../../v1/ts/interfaces/global_interfaces";
import OrderServices from "../services/order.services";

const {
  Order,
  OrderProductList,
  OrderTag,
  AgencyBranch,
  AgencyBranchProductList,
} = db;

class OrderController {
  public static async getAll(req: Request, res: Response, next: NextFunction) {
    const { order_type } = req.query;
    try {
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
      const { id, order_type } = req.query;

      const { statusCode, data } = await OrderServices.getByID({
        id: id as string,
        order_type: order_type as string,
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
      public static async updateDetailByID(
        req: Request,
        res: Response,
        next: NextFunction
      ) {
        try {
          const { order_status } = req.body;
          const { id: order_id } = req.params;

          const argMissArr = checkMissPropertyInObjectBaseOnValueCondition(
            {
              order_status,
            },
            undefined
          );

          if (isEmpty(argMissArr)) {
            // ? Check status => ...
            // * [ GENERATE , TRADING , DONE ]
            switch (order_status) {
              // ? DONE || RETURN => Do not Allow => DONE
              case ORDER_IMPORT_STATUS.DONE:
              case ORDER_IMPORT_STATUS.RETURN: {
                res
                  .status(STATUS_CODE.STATUS_CODE_406)
                  .send(
                    RestFullAPI.onSuccess(
                      STATUS_MESSAGE.NOT_ACCEPTABLE,
                      `You cann't modify because order_status: ${ORDER_IMPORT_STATUS.DONE}`
                    )
                  );
                break;
              } // ? TRADING => Allow modify [ tag , note ] => DONE
              case ORDER_IMPORT_STATUS.TRADING: {
                const { order_note, tags } = req.body;
                // * Check user has entered attributes require or not [ tags , order_note ]

                if (order_note || tags) {
                  // ? Delete old tags
                  await OrderTag.destroy({
                    where: { order_id },
                  });
                  // ? Generate & Update new one [ tags , order ]
                  const updateTagRowArr: OrderTagAttributes[] = tags.map(
                    (tagID: string) => ({
                      tag_id: tagID,
                      order_id: order_id,
                    })
                  );
                  await Order.update(
                    { order_note },
                    {
                      where: {
                        id: order_id,
                        order_type: ORDER_TYPE.IMPORT,
                      },
                    }
                  );
                  await OrderTag.bulkCreate(updateTagRowArr);

                  res
                    .status(STATUS_CODE.STATUS_CODE_201)
                    .send(RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS));
                } else {
                  const attrMissArray =
                    checkMissPropertyInObjectBaseOnValueCondition(
                      { order_note, tags },
                      undefined
                    );
                  const errMess: string =
                    attrMissArray.join(" || ") + " " + "is required!";

                  res
                    .status(STATUS_CODE.STATUS_CODE_406)
                    .send(
                      RestFullAPI.onSuccess(
                        STATUS_MESSAGE.NOT_ACCEPTABLE,
                        errMess
                      )
                    );
                }

                break;
              }
              // ? GENERATE => Allow change almost
              // ? [ supplier_id , staff_id , order_date , order_delivery_date , order_note  , tag , products ]
              // ? => Done
              case ORDER_IMPORT_STATUS.GENERATE: {
                const {
                  supplier_id,
                  staff_id,
                  order_date,
                  order_delivery_date,
                  order_note,
                  tags,
                  products,
                } = req.body;

                const foundOrder = await Order.findOne({
                  where: {
                    id: order_id,
                  },
                });

                const updateOrderRow = handleFormatUpdateDataByValidValue(
                  {
                    supplier_id,
                    staff_id,
                    order_date,
                    order_delivery_date,
                    order_note,
                  },
                  foundOrder.dataValues
                );
                // ? Update general order detail
                await Order.update(updateOrderRow, {
                  where: {
                    id: order_id,
                  },
                });

                // ? Delete old tags and products
                await OrderTag.destroy({
                  where: {
                    order_id,
                  },
                });

                await OrderProductList.destroy({
                  where: {
                    order_id,
                  },
                });
                // ? If input tags and products empty  -> just delete
                // ? If input tags and products !empty -> Update new tags and products
                if (!isEmpty(tags)) {
                  const newOrderTagRowArr: Array<string> = tags.map(
                    (tag_id: string) => ({
                      order_id,
                      tag_id,
                    })
                  );
                  await OrderTag.bulkCreate(newOrderTagRowArr);
                }
                if (!isEmpty(products)) {
                  const orderProductRowArr: Array<OrderProductListAttributes> =
                    products.map(
                      ({
                        p_variant_id: product_variant_id,
                        amount: product_amount,
                        price: product_price,
                        discount: product_discount,
                        unit: product_unit,
                      }: ObjectDynamicKeyWithValue) => ({
                        order_id,
                        product_variant_id,
                        product_amount,
                        product_price,
                        product_discount,
                        product_unit,
                      })
                    );
                  await OrderProductList.bulkCreate(orderProductRowArr);
                }

                res.status(STATUS_CODE.STATUS_CODE_201).send(
                  RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS, {
                    updateOrderRow,
                  })
                );
                break;
              }
              default: {
                res
                  .status(STATUS_CODE.STATUS_CODE_406)
                  .send(
                    RestFullAPI.onSuccess(
                      STATUS_MESSAGE.NOT_ACCEPTABLE,
                      `order_status must be ${ORDER_IMPORT_STATUS.DONE} | ${ORDER_IMPORT_STATUS.GENERATE} | ${ORDER_IMPORT_STATUS.TRADING}`
                    )
                  );
                break;
              }
            }
          } else {
            res
              .status(STATUS_CODE.STATUS_CODE_406)
              .send(
                RestFullAPI.onSuccess(
                  STATUS_MESSAGE.NOT_ACCEPTABLE,
                  `${argMissArr.join("")} is required! - Example: ${
                    ORDER_IMPORT_STATUS.DONE
                  } | ${ORDER_IMPORT_STATUS.GENERATE} | ${
                    ORDER_IMPORT_STATUS.TRADING
                  } `
                )
              );
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
          const { id } = req.params;
          const { order_status } = req.body;

          const argMissArr = checkMissPropertyInObjectBaseOnValueCondition(
            { order_status },
            undefined
          );

          switch (isEmpty(argMissArr)) {
            case true: {
              // ? check order_status - order_status must be [ cancel , trading , return ]
              switch (order_status) {
                // ? Accept update
                case ORDER_IMPORT_STATUS.CANCEL:
                case ORDER_IMPORT_STATUS.TRADING: {
                  await Order.update(
                    { order_status },
                    {
                      where: { id },
                    }
                  );
                  res
                    .status(STATUS_CODE.STATUS_CODE_201)
                    .send(RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS));
                  break;
                }
                // ? Case return
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

                // ? Case Done
                case ORDER_IMPORT_STATUS.DONE: {
                  const foundOrder = await Order.findOne({
                    where: { id },
                    attributes: ["id"],
                    include: [
                      { model: AgencyBranch, attributes: ["id"] },
                      {
                        model: OrderProductList,
                        attributes: [
                          "product_variant_id",
                          "product_amount",
                          "product_discount",
                          "product_price",
                        ],
                      },
                    ],
                  });

                  type AgencyBranchProductListQueryAttributes = {
                    dataValues: AgencyBranchProductListAttributes;
                  };

                  const foundAgencyBranchProductList: Array<AgencyBranchProductListQueryAttributes> =
                    await AgencyBranchProductList.findAll({
                      where: {
                        agency_branch_id:
                          foundOrder.dataValues.AgencyBranch.dataValues.id,
                      },
                    });

                  // ? Check if the product is still in stock
                  const productExistInStockIndex = (
                    product_variant_id: string
                  ): number => {
                    return foundAgencyBranchProductList.findIndex(
                      (
                        agency_product_item: AgencyBranchProductListQueryAttributes
                      ) => {
                        return (
                          agency_product_item.dataValues.product_variant_id ===
                          product_variant_id
                        );
                      }
                    );
                  };

                  type OrderProductListQueryAttributes = {
                    dataValues: OrderProductListAttributes;
                  };

                  const {
                    newProductInStockRowArr,
                    updateProductInStockRowArr,
                  }: ObjectDynamicKeyWithValue =
                    foundOrder.dataValues.OrderProductLists.reduce(
                      (
                        result: ObjectDynamicKeyWithValue,
                        order_product_item: OrderProductListQueryAttributes
                      ) => {
                        const {
                          product_variant_id,
                          product_amount,
                          product_discount,
                          product_price,
                        } = order_product_item.dataValues;
                        if (
                          productExistInStockIndex(product_variant_id) !== -1
                        ) {
                          result.updateProductInStockRowArr.push({
                            agency_branch_id:
                              foundOrder.dataValues.AgencyBranch.dataValues.id,
                            product_variant_id,
                            product_amount,
                            product_price,
                            product_amount_inStock:
                              foundAgencyBranchProductList[
                                productExistInStockIndex(product_variant_id)
                              ].dataValues.available_to_sell_quantity,
                            product_price_inStock:
                              foundAgencyBranchProductList[
                                productExistInStockIndex(product_variant_id)
                              ].dataValues.product_price,
                          });
                        } else {
                          result.newProductInStockRowArr.push({
                            agency_branch_id:
                              foundOrder.dataValues.AgencyBranch.dataValues.id,
                            product_variant_id,
                            available_quantity: product_amount,
                            trading_quantity: 0,
                            available_to_sell_quantity: product_amount,
                            product_price,
                            product_discount,
                          });
                        }

                        return result;
                      },
                      {
                        newProductInStockRowArr: [],
                        updateProductInStockRowArr: [],
                      }
                    );
                  // ? => true -> update amount
                  if (!isEmpty(updateProductInStockRowArr)) {
                    updateProductInStockRowArr.forEach(
                      async ({
                        agency_branch_id,
                        product_variant_id,
                        product_amount,
                        product_price,
                        product_amount_inStock,
                        product_price_inStock,
                      }) => {
                        const updateProductInStock = {
                          product_price:
                            (product_amount_inStock * product_price_inStock +
                              product_amount * product_price) /
                            (product_amount_inStock + product_amount),
                          available_quantity:
                            foundAgencyBranchProductList[
                              productExistInStockIndex(product_variant_id)
                            ].dataValues.available_quantity + product_amount,
                          available_to_sell_quantity:
                            foundAgencyBranchProductList[
                              productExistInStockIndex(product_variant_id)
                            ].dataValues.available_to_sell_quantity +
                            product_amount,
                          updatedAt: new Date(),
                        };

                        await AgencyBranchProductList.update(
                          updateProductInStock,
                          {
                            where: { agency_branch_id, product_variant_id },
                          }
                        );
                      }
                    );
                  }
                  // ? => false -> create new
                  if (!isEmpty(newProductInStockRowArr)) {
                    await AgencyBranchProductList.bulkCreate(
                      newProductInStockRowArr
                    );
                  }
                  res
                    .status(STATUS_CODE.STATUS_CODE_201)
                    .send(RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS));
                }

                // ! Deny update
                default: {
                  res
                    .status(STATUS_CODE.STATUS_CODE_406)
                    .send(
                      RestFullAPI.onSuccess(
                        STATUS_MESSAGE.NOT_ACCEPTABLE,
                        `order_status: '${order_status}' in-valid! - Example: ${ORDER_IMPORT_STATUS.CANCEL} | ${ORDER_IMPORT_STATUS.GENERATE} | ${ORDER_IMPORT_STATUS.TRADING} | ${ORDER_IMPORT_STATUS.DONE} | ${ORDER_IMPORT_STATUS.RETURN}`
                      )
                    );
                  break;
                }
              }
              break;
            }
            case false: {
              res
                .status(STATUS_CODE.STATUS_CODE_406)
                .send(
                  RestFullAPI.onSuccess(
                    STATUS_MESSAGE.NOT_ACCEPTABLE,
                    `${argMissArr.join("")} is required! - Example: ${
                      ORDER_IMPORT_STATUS.CANCEL
                    } | ${ORDER_IMPORT_STATUS.GENERATE} | ${
                      ORDER_IMPORT_STATUS.TRADING
                    } | ${ORDER_IMPORT_STATUS.DONE} | ${
                      ORDER_IMPORT_STATUS.RETURN
                    }`
                  )
                );
              break;
            }
          }
        } catch (err) {
          next(err);
        }
      }
    };
  }
  public static Purchase() {
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
            order_type: ORDER_TYPE.PURCHASE,
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