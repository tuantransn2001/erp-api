import { v4 as uuiv4 } from "uuid";
import { randomStringByCharsetAndLength } from "../../v1/common";
import {
  ORDER_IMPORT_STATUS,
  ORDER_SALE_STATUS,
  ORDER_TYPE,
} from "../ts/enums/order_enum";
import { CUSTOMER_ACTION } from "../../v1/ts/enums/app_enums";
import {
  DebtAttributes,
  OrderAttributes,
  OrderProductListAttributes,
  OrderTagAttributes,
} from "../../v1/ts/interfaces/app_interfaces";
import RestFullAPI from "../utils/response/apiResponse";
import { STATUS_CODE, STATUS_MESSAGE } from "../../v1/ts/enums/api_enums";
import {
  checkMissPropertyInObjectBaseOnValueCondition,
  isEmpty,
} from "../../v1/common";
import db from "../models";
import HttpException from "../utils/exceptions/http.exception";
import { handleFormatOrder } from "../utils/format/order.format";
import { ObjectType } from "../ts/types/app_type";
const {
  Customer,
  UserAddress,
  User,
  Order,
  OrderProductList,
  OrderTag,
  Debt,
  Staff,
  AgencyBranch,
  Tag,
  ProductVariantDetail,
  Payment,
  Shipper,
} = db;

type ProductItem = {
  p_variant_id: string;
  unit: string;
  price: number;
  amount: number;
  discount: number;
};

type OrderDataAttributes = {
  supplier_id: string;
  agency_branch_id: string;
  shipper_id: string;
  payment_id: string;
  staff_id: string;
  order_delivery_date: Date;
  order_note: string;
  order_type: string;
  tags: Array<string>;
  products: Array<ProductItem>;
};

type QueryConditionAttributes = {
  id: string;
  order_type: string;
};

type UpdateDetailDataAttributes = {
  queryCondition: { id: string };
  updateData: OrderAttributes;
};
type OrderProductAttributes = {
  order_id: string;
  products: Array<ProductItem>;
};
type UpdateOrderProductListDataAttributes = {
  queryCondition: { order_id: string };
  JunctionModel: any;
  updateProductsData: Array<ProductItem>;
};

class OrderServices {
  public static calculateOrderTotal(productList: Array<ProductItem>) {
    return productList.reduce((total: number, product: ProductItem) => {
      total +=
        (product.amount * product.price * (100 - product.discount)) / 100;
      return total;
    }, 0);
  }
  public static async getAll(order_type: string) {
    try {
      const orderList = await Order.findAll({
        where: {
          order_type,
        },
        attributes: [
          "id",
          "order_status",
          "order_code",
          "order_note",
          "order_total",
          "createdAt",
        ],
        include: [
          {
            model: Customer,
            attributes: ["id"],
            include: [
              {
                model: User,
                attributes: ["id", "user_name", "user_phone"],
              },
            ],
          },
          {
            model: Staff,
            attributes: ["id"],
            include: [
              {
                model: User,
                attributes: ["user_name"],
              },
            ],
          },
          {
            model: AgencyBranch,
            attributes: ["id", "agency_branch_name"],
          },
          {
            model: OrderProductList,
            attributes: ["product_amount", "product_discount", "product_price"],
          },
        ],
      });

      return {
        statusCode: STATUS_CODE.STATUS_CODE_200,
        data: RestFullAPI.onSuccess(
          STATUS_MESSAGE.SUCCESS,
          handleFormatOrder(orderList, "isArray")
        ),
      };
    } catch (err) {
      const customErr = err as HttpException;

      return {
        statusCode: STATUS_CODE.STATUS_CODE_500,
        data: RestFullAPI.onSuccess(STATUS_MESSAGE.SERVER_ERROR, {
          message: customErr.message,
        }),
      };
    }
  }
  public static async getByID(queryConditions: QueryConditionAttributes) {
    try {
      const foundOrder = await Order.findOne({
        where: queryConditions,
        attributes: [
          "id",
          "order_note",
          "order_status",
          "order_total",
          "order_code",
          "order_delivery_date",
          "shipper_id",
          "createdAt",
        ],
        include: [
          {
            model: Shipper,
            attributes: ["id", "shipper_unit", "shipper_phone"],
          },
          {
            model: Payment,
            attributes: ["id", "payment_type"],
          },
          {
            model: Customer,
            attributes: ["id"],
            include: [
              {
                model: User,
                attributes: ["id", "user_name", "user_phone"],
                include: [
                  {
                    model: UserAddress,
                    attributes: ["id", "user_specific_address"],
                  },
                  {
                    attributes: ["id", "debt_amount"],
                    model: Debt,
                  },
                ],
              },
            ],
          },
          {
            attributes: ["id"],
            model: Staff,
            include: [
              {
                attributes: ["id", "user_name"],
                model: User,
              },
            ],
          },
          {
            attributes: ["id", "agency_branch_name"],
            model: AgencyBranch,
          },
          {
            model: OrderTag,
            attributes: ["id"],
            include: [
              {
                model: Tag,
                attributes: ["id", "tag_title"],
              },
            ],
          },
          {
            model: OrderProductList,
            separate: true,
            attributes: [
              "id",
              "product_variant_id",
              "product_amount",
              "product_discount",
              "product_unit",
              "product_price",
            ],
            include: [
              {
                model: ProductVariantDetail,
                attributes: [
                  "id",
                  "product_variant_name",
                  "product_variant_SKU",
                ],
              },
            ],
          },
        ],
      });
      console.log(foundOrder);
      return {
        statusCode: STATUS_CODE.STATUS_CODE_200,
        data: RestFullAPI.onSuccess(
          STATUS_MESSAGE.SUCCESS,
          handleFormatOrder(foundOrder, "isObject")
        ),
      };
    } catch (err) {
      const customErr = err as HttpException;

      return {
        statusCode: STATUS_CODE.STATUS_CODE_406,
        data: RestFullAPI.onSuccess(STATUS_MESSAGE.NOT_ACCEPTABLE, {
          message: customErr.message,
        }),
      };
    }
  }
  public static async generateOrderProducts({
    order_id,
    products,
  }: OrderProductAttributes) {
    // ? ===== Generate product list
    const orderProductRowArr: Array<OrderProductListAttributes> = products.map(
      ({
        p_variant_id: product_variant_id,
        amount: product_amount,
        price: product_price,
        discount: product_discount,
        unit: product_unit,
      }: ObjectType) => ({
        id: uuiv4(),
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
  public static async create(orderData: OrderDataAttributes) {
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
        order_type,
      } = orderData;

      const order_total: number = OrderServices.calculateOrderTotal(products);
      // ? ===== Generate order
      const orderRow: OrderAttributes = {
        id: uuiv4(),
        agency_branch_id,
        shipper_id,
        payment_id,
        staff_id,
        supplier_id,
        order_code: randomStringByCharsetAndLength("alphabet", 5, true),
        order_delivery_date,
        order_note,
        order_type,
        order_status: ORDER_IMPORT_STATUS.GENERATE,
        order_total: order_total,
      };

      const foundOrderOwner = await Customer.findOne({
        where: {
          id: supplier_id,
        },
        attributes: ["id"],
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

      const orderTagRowArr: Array<OrderTagAttributes> = tags.map(
        (tagID: string) => ({
          id: uuiv4(),
          order_id: orderRow.id,
          tag_id: tagID,
        })
      );

      const userID: string = foundOrderOwner.dataValues.User.dataValues.id;
      const debtRow: DebtAttributes = {
        id: uuiv4(),
        source_id: orderRow.id,
        user_id: userID,
        debt_amount: `-${order_total}`,
        change_debt: `-${order_total}`,
        debt_note: `${ORDER_SALE_STATUS.GENERATE} ${ORDER_TYPE.SALE}`,
        action: CUSTOMER_ACTION.PURCHASE,
      };

      const isAcceptCreate = () => {
        const isOrderRowValid = isEmpty(
          checkMissPropertyInObjectBaseOnValueCondition(orderRow, undefined)
        );
        const isDebtRowValid = isEmpty(
          checkMissPropertyInObjectBaseOnValueCondition(debtRow, undefined)
        );

        return isOrderRowValid && isDebtRowValid;
      };

      if (isAcceptCreate()) {
        await Order.create(orderRow);
        !isEmpty(orderTagRowArr) && (await OrderTag.bulkCreate(orderTagRowArr));
        await Debt.create(debtRow);

        switch (order_type) {
          case ORDER_TYPE.IMPORT: {
            await OrderServices.generateOrderProducts({
              order_id: orderRow.id,
              products,
            });
          }
          case ORDER_TYPE.SALE: {
            await OrderServices.generateOrderProducts({
              order_id: orderRow.id,
              products,
            });
            await OrderServices.updateAgencyProductsAmount({
              products,
            });
          }
        }

        return {
          statusCode: STATUS_CODE.STATUS_CODE_200,
          data: RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS),
        };
      } else {
        const responseMessage: string =
          checkMissPropertyInObjectBaseOnValueCondition(orderRow, undefined)
            .concat(
              checkMissPropertyInObjectBaseOnValueCondition(debtRow, undefined)
            )
            .join(",") + " is required!";

        return {
          statusCode: STATUS_CODE.STATUS_CODE_406,
          data: RestFullAPI.onSuccess(STATUS_MESSAGE.NOT_ACCEPTABLE, {
            message: responseMessage,
          }),
        };
      }
    } catch (err) {
      const customErr = err as HttpException;
      return {
        statusCode: STATUS_CODE.STATUS_CODE_500,
        data: RestFullAPI.onSuccess(STATUS_MESSAGE.SERVER_ERROR, {
          message: customErr.message,
        }),
      };
    }
  }
  public static async updateOrderProductList(
    updateOrderProductListData: UpdateOrderProductListDataAttributes
  ) {
    const { updateProductsData, JunctionModel, queryCondition } =
      updateOrderProductListData;

    const { order_id } = updateOrderProductListData.queryCondition;

    const argMissArr = checkMissPropertyInObjectBaseOnValueCondition(
      updateProductsData,
      undefined
    );

    await JunctionModel.destroy({
      where: queryCondition,
    });

    if (isEmpty(argMissArr)) {
      const orderProductRowArr: Array<OrderProductListAttributes> =
        updateProductsData.map(
          ({
            p_variant_id: product_variant_id,
            amount: product_amount,
            price: product_price,
            discount: product_discount,
            unit: product_unit,
          }) => ({
            id: uuiv4(),
            order_id,
            product_variant_id,
            product_amount,
            product_price,
            product_discount,
            product_unit,
          })
        );

      return await JunctionModel.bulkCreate(orderProductRowArr)
        .then(() => {
          return {
            statusCode: STATUS_CODE.STATUS_CODE_200,
            data: RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS),
          };
        })
        .catch((err: HttpException) => {
          return {
            statusCode: STATUS_CODE.STATUS_CODE_500,
            data: RestFullAPI.onSuccess(STATUS_MESSAGE.SERVER_ERROR, {
              message: err.message,
            }),
          };
        });
    } else {
      return {
        statusCode: STATUS_CODE.STATUS_CODE_406,
        data: RestFullAPI.onSuccess(STATUS_MESSAGE.NOT_ACCEPTABLE, {
          message: argMissArr.join(",") + " is required!",
        }),
      };
    }
  }
  public static async updateDetail(
    updateDetailData: UpdateDetailDataAttributes
  ) {
    const { queryCondition, updateData } = updateDetailData;

    return await Order.update(updateData, { where: queryCondition })
      .then(() => {
        return {
          statusCode: STATUS_CODE.STATUS_CODE_200,
          data: RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS),
        };
      })
      .catch((err: HttpException) => {
        return {
          statusCode: STATUS_CODE.STATUS_CODE_500,
          data: RestFullAPI.onSuccess(STATUS_MESSAGE.SERVER_ERROR, {
            message: err.message,
          }),
        };
      });
  }
  public static async updateAgencyProductsAmount({
    products,
  }: Omit<OrderProductAttributes, "order_id">) {
    products.forEach(async (p: ProductItem) => {
      await db.AgencyBranchProductList.update(
        {
          available_quantity: db.sequelize.literal(
            `available_quantity - ${p.amount}`
          ),
          available_to_sell_quantity: db.sequelize.literal(
            `available_to_sell_quantity - ${p.amount}`
          ),
          trading_quantity: db.sequelize.literal(
            `trading_quantity + ${p.amount}`
          ),
        },
        {
          where: {
            product_variant_id: p.p_variant_id,
          },
        }
      );
    });
  }
}

export default OrderServices;
