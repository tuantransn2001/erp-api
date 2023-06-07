import {
  DebtAttributes,
  OrderAttributes,
  OrderProductListAttributes,
  OrderTagAttributes,
} from "../ts/interfaces/app_interfaces";
import RestFullAPI from "../utils/response/apiResponse";
import { STATUS_CODE, STATUS_MESSAGE } from "../ts/enums/api_enums";
import {
  checkMissPropertyInObjectBaseOnValueCondition,
  isEmpty,
} from "../common";
import db from "../models";
import HttpException from "../utils/exceptions/http.exception";
import { handleFormatOrder } from "../utils/format/order.format";
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

type OrderDataAttributes = {
  orderRow: OrderAttributes;
  orderTagRowArr: Array<OrderTagAttributes>;
  orderProductRowArr: Array<OrderProductListAttributes>;
  debtRow: DebtAttributes;
};

type QueryConditionAttributes = {
  id: string;
  order_type: string;
};

class OrderServices {
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
    try {
      const isAcceptCreate = () => {
        const isOrderRowValid = isEmpty(
          checkMissPropertyInObjectBaseOnValueCondition(
            orderData.orderRow,
            undefined
          )
        );
        const isDebtRowValid = isEmpty(
          checkMissPropertyInObjectBaseOnValueCondition(
            orderData.debtRow,
            undefined
          )
        );

        const isOrderProductRowArrValid = !isEmpty(
          orderData.orderProductRowArr
        );

        return isOrderRowValid && isDebtRowValid && isOrderProductRowArrValid;
      };

      if (isAcceptCreate()) {
        await Order.create(orderData.orderRow);
        !isEmpty(orderData.orderTagRowArr) &&
          (await OrderTag.bulkCreate(orderData.orderTagRowArr));
        await OrderProductList.bulkCreate(orderData.orderProductRowArr);
        await Debt.create(orderData.debtRow);

        return {
          statusCode: STATUS_CODE.STATUS_CODE_200,
          data: RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS),
        };
      } else {
        const responseMessage: string =
          checkMissPropertyInObjectBaseOnValueCondition(
            orderData.orderRow,
            undefined
          )
            .concat(
              checkMissPropertyInObjectBaseOnValueCondition(
                orderData.debtRow,
                undefined
              )
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
