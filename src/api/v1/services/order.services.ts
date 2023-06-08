import { v4 as uuiv4 } from "uuid";
import { randomStringByCharsetAndLength } from "../../v1/common";
import {
  ORDER_IMPORT_STATUS,
  ORDER_PURCHASE_STATUS,
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
import { ObjectDynamicKeyWithValue } from "../ts/interfaces/global_interfaces";
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
  public static async getByID(queryCondition: QueryConditionAttributes) {
    try {
      const { id, order_type } = queryCondition;

      const foundOrder = await Order.findOne({
        where: { id, order_type },
        attributes: [
          "id",
          "order_note",
          "order_status",
          "order_total",
          "order_code",
        ],
        include: [
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
        statusCode: STATUS_CODE.STATUS_CODE_500,
        data: RestFullAPI.onSuccess(STATUS_MESSAGE.SERVER_ERROR, {
          message: customErr.message,
        }),
      };
    }
  }
  public static async create(orderData: OrderDataAttributes) {
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
    // ? ===== Generate product list
    const orderProductRowArr: Array<OrderProductListAttributes> = products.map(
      ({
        p_variant_id: product_variant_id,
        amount: product_amount,
        price: product_price,
        discount: product_discount,
        unit: product_unit,
      }: ObjectDynamicKeyWithValue) => ({
        id: uuiv4(),
        order_id: orderRow.id,
        product_variant_id,
        product_amount,
        product_price,
        product_discount,
        product_unit,
      })
    );

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
      (tagID: string) => ({ id: uuiv4(), order_id: orderRow.id, tag_id: tagID })
    );

    const userID: string = foundOrderOwner.dataValues.User.dataValues.id;
    const debtRow: DebtAttributes = {
      id: uuiv4(),
      source_id: orderRow.id,
      user_id: userID,
      debt_amount: `-${order_total}`,
      change_debt: `-${order_total}`,
      debt_note: `${ORDER_PURCHASE_STATUS.GENERATE} ${ORDER_TYPE.PURCHASE}`,
      action: CUSTOMER_ACTION.PURCHASE,
    };

    try {
      const isAcceptCreate = () => {
        const isOrderRowValid = isEmpty(
          checkMissPropertyInObjectBaseOnValueCondition(orderRow, undefined)
        );
        const isDebtRowValid = isEmpty(
          checkMissPropertyInObjectBaseOnValueCondition(debtRow, undefined)
        );

        const isOrderProductRowArrValid = !isEmpty(orderProductRowArr);

        return isOrderRowValid && isDebtRowValid && isOrderProductRowArrValid;
      };

      if (isAcceptCreate()) {
        await Order.create(orderRow);
        !isEmpty(orderTagRowArr) && (await OrderTag.bulkCreate(orderTagRowArr));
        await OrderProductList.bulkCreate(orderProductRowArr);
        await Debt.create(debtRow);

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
}

export default OrderServices;
