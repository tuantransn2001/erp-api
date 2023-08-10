import { v4 as uuiv4 } from "uuid";
import { randomStringByCharsetAndLength, removeItem } from "../../v2/common";
import {
  ORDER_IMPORT_STATUS,
  ORDER_SALE_STATUS,
  ORDER_TYPE,
} from "../ts/enums/order_enum";
import { CUSTSUPP_ACTION } from "../../v2/ts/enums/app_enums";
import {
  DebtAttributes,
  OrderAttributes,
  OrderProductListAttributes,
  OrderTagAttributes,
} from "../ts/interfaces/entities_interfaces";
import RestFullAPI from "../utils/response/apiResponse";
import { STATUS_CODE, STATUS_MESSAGE } from "../../v2/ts/enums/api_enums";
import {
  checkMissPropertyInObjectBaseOnValueCondition,
  isEmpty,
} from "../../v2/common";
import db from "../models";
import HttpException from "../utils/exceptions/http.exception";
import { handleFormatOrder } from "../utils/format/order.format";
import { ObjectType } from "../ts/types/common";
import { handleError } from "../utils/handleError/handleError";
import DebtService from "./debt.services";
const {
  CustSupp,
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

type OrderDataPayload = {
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

type UpdateDetailDataPayload = {
  queryCondition: { id: string };
  updateData: OrderAttributes;
};
type OrderProductAttributes = {
  order_type: string;
  order_id: string;
  products: Array<ProductItem>;
  operator?: string;
  agency_branch_id?: string;
};
type UpdateOrderProductListPayload = {
  queryCondition: { order_id: string };
  JunctionModel: any;
  updateProductsData: Array<ProductItem>;
};

type UpdateOrderOnSuccessPayload = {
  order_id: string;
  user_id: string;
};

type UpdateOrderStatusPayload = {
  order_id: string;
  update_status: string;
};

class OrderServices {
  public static calculateOrderTotal(productList: ProductItem[]) {
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
            model: CustSupp,
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
            model: CustSupp,
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
        statusCode: STATUS_CODE.STATUS_CODE_406,
        data: RestFullAPI.onSuccess(STATUS_MESSAGE.NOT_ACCEPTABLE, {
          message: customErr.message,
        }),
      };
    }
  }
  // ? Tạo record sản phẩm khi đơn hàng được tạo
  public static async generateOrderProducts({
    order_id,
    products,
  }: OrderProductAttributes) {
    const orderProductRowArr: Partial<OrderProductListAttributes>[] =
      products.map(
        ({
          p_variant_id: product_variant_id,
          amount: product_amount,
          price: product_price,
          discount: product_discount,
          unit: product_unit,
        }) => {
          return {
            id: uuiv4(),
            order_id,
            product_variant_id,
            product_amount,
            product_price,
            product_discount,
            product_unit,
          };
        }
      );

    await OrderProductList.bulkCreate(orderProductRowArr);
  }
  public static async create(orderData: OrderDataPayload) {
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
        custSupp_id: supplier_id,
        order_code: randomStringByCharsetAndLength("alphabet", 5, true),
        order_delivery_date,
        order_note,
        order_type,
        order_status:
          order_type === ORDER_TYPE.IMPORT
            ? ORDER_IMPORT_STATUS.GENERATE
            : ORDER_SALE_STATUS.GENERATE,
        order_total: order_total,
      };

      const foundOrderOwner = await CustSupp.findOne({
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
        action: CUSTSUPP_ACTION.PURCHASE,
      };

      const isAcceptCreate = () => {
        const isOrderRowValid = isEmpty(
          checkMissPropertyInObjectBaseOnValueCondition(orderRow, [undefined])
        );
        const isDebtRowValid = isEmpty(
          checkMissPropertyInObjectBaseOnValueCondition(debtRow, [undefined])
        );

        return isOrderRowValid && isDebtRowValid;
      };

      if (isAcceptCreate()) {
        await Order.create(orderRow);
        !isEmpty(orderTagRowArr) && (await OrderTag.bulkCreate(orderTagRowArr));
        await Debt.create(debtRow);

        await OrderServices.generateOrderProducts({
          order_id: orderRow.id,
          products,
          order_type,
        });
        return {
          statusCode: STATUS_CODE.STATUS_CODE_200,
          data: RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS),
        };
      } else {
        const responseMessage: string =
          checkMissPropertyInObjectBaseOnValueCondition(orderRow, [undefined])
            .concat(
              checkMissPropertyInObjectBaseOnValueCondition(debtRow, [
                undefined,
              ])
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
    updateOrderProductListData: UpdateOrderProductListPayload
  ) {
    const { updateProductsData, JunctionModel, queryCondition } =
      updateOrderProductListData;

    const { order_id } = updateOrderProductListData.queryCondition;

    const argMissArr = checkMissPropertyInObjectBaseOnValueCondition(
      updateProductsData,
      [undefined]
    );

    if (isEmpty(argMissArr)) {
      const orderProductRowArr: Array<Partial<OrderProductListAttributes>> =
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
      // ? ======================================================================
      // ? Reset Old Product Data ( restore available to sell , available )
      // ? ======================================================================

      // ? Update Agency Product Amount - ORDER SALE Only
      const getCurrentOrderDetail = async () => {
        const foundOrder = await Order.findOne({
          where: { id: order_id },
          include: [
            {
              model: OrderProductList,
            },
          ],
        });

        return {
          type: foundOrder.dataValues.order_type,
          resetOldProductAmountData:
            foundOrder.dataValues.OrderProductLists.map(
              (order_product_item: {
                dataValues: OrderProductListAttributes;
              }) => {
                const {
                  product_variant_id: p_variant_id,
                  product_amount: amount,
                } = order_product_item.dataValues;

                return { p_variant_id, amount };
              }
            ),
        };
      };

      if ((await getCurrentOrderDetail()).type === ORDER_TYPE.SALE) {
        await OrderServices.updateAgencyProductsAmountOnOrderUpdate({
          products: (await getCurrentOrderDetail()).resetOldProductAmountData,
          operator: "plus",
        });
      }

      await JunctionModel.destroy({
        where: queryCondition,
      });

      // ? ======================================================================
      // ? Add New Product Data ( new available to sell , available )
      // ? ======================================================================

      await JunctionModel.bulkCreate(orderProductRowArr);

      return {
        statusCode: STATUS_CODE.STATUS_CODE_200,
        data: RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS),
      };
    } else {
      return {
        statusCode: STATUS_CODE.STATUS_CODE_406,
        data: RestFullAPI.onSuccess(STATUS_MESSAGE.NOT_ACCEPTABLE, {
          message: argMissArr.join(",") + " is required!",
        }),
      };
    }
  }
  public static async updateDetail(updateDetailData: UpdateDetailDataPayload) {
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
  // ? Cập nhật số lượng sản phẩm trong kho khi đơn hàng bán ra hoặc nhập hàng vào
  // ? operator: ["plus","minus"]
  public static async updateAgencyProductsAmountOnOrderUpdate({
    products,
    operator,
  }: Omit<OrderProductAttributes, "order_type" | "order_id">) {
    const OPERATOR = {
      minus: "-",
      plus: "+",
    };
    type Key = keyof typeof OPERATOR;
    products.forEach(async ({ amount, p_variant_id }: ProductItem) => {
      await db.AgencyBranchProductList.update(
        {
          available_quantity: db.sequelize.literal(
            `available_quantity ${OPERATOR[operator as Key]} ${amount}`
          ),
          available_to_sell_quantity: db.sequelize.literal(
            `available_to_sell_quantity ${OPERATOR[operator as Key]} ${amount}`
          ),
          trading_quantity: db.sequelize.literal(
            `trading_quantity ${
              operator === "minus" ? OPERATOR["plus"] : OPERATOR["minus"]
            } ${amount}`
          ),
        },
        {
          where: {
            product_variant_id: p_variant_id,
          },
        }
      );
    });
  }
  // ? Chuyển trạng thái đơn hàng sang hoàn thành khi:
  // ? + Khi khách hàng / nhà cung cấp đã thanh toán
  // ? + Đơn hàng ở trạng thái cuối ( đơn bán là DELIVER-Xuất kho || đơn nhập là TRADING-Đang giao dịch )
  public static async updateOrderOnSuccess({
    user_id,
    order_id,
  }: UpdateOrderOnSuccessPayload) {
    try {
      const VALID_ORDER_NEAREST_SUCCESS = [
        ORDER_IMPORT_STATUS.TRADING,
        ORDER_SALE_STATUS.DELIVERY,
      ];

      const UPDATE_ORDER_STATUS = {
        [ORDER_TYPE.IMPORT]: ORDER_IMPORT_STATUS.DONE,
        [ORDER_TYPE.SALE]: ORDER_SALE_STATUS.DONE,
      };

      // ? Check total debt
      // ? Check last status
      const foundOrder = await Order.findOne({
        where: {
          id: order_id,
        },
        attributes: ["order_status", "order_type"],
      });
      const { data: debtData }: ObjectType<any> = await DebtService.getTotal({
        user_id: user_id as string,
      });

      const { order_status, order_type } = foundOrder.dataValues;

      const isOK = () => {
        const { debt_amount }: ObjectType<string> = debtData.data;

        const isPaymentSuccess = parseFloat(debt_amount) === 0;

        const isValidOrderStatus =
          VALID_ORDER_NEAREST_SUCCESS.includes(order_status);

        return isPaymentSuccess && isValidOrderStatus;
      };

      if (isOK()) {
        // ? => Accept update => Update => Return
        foundOrder.order_status = UPDATE_ORDER_STATUS[order_type];
        await foundOrder.save();
        // TODO : Update amount [ agency product ] ...
      }

      return {
        statusCode: STATUS_CODE.STATUS_CODE_200,
        data: RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS),
      };
    } catch (err) {
      return {
        statusCode: STATUS_CODE.STATUS_CODE_500,
        data: handleError(err as Error),
      };
    }
  }

  // ? Cập nhật trạng thái đơn hàng
  public static async updateOrderStatus({
    order_id,
    update_status,
  }: UpdateOrderStatusPayload) {
    try {
      const ORDER_STATUS_BASE_ON_ORDER_TYPE = {
        [ORDER_TYPE.IMPORT]: Object.values(
          removeItem(Object.values(ORDER_IMPORT_STATUS), [
            ORDER_IMPORT_STATUS.DONE,
            ORDER_IMPORT_STATUS.RETURN,
          ])
        ),
        [ORDER_TYPE.SALE]: Object.values(
          removeItem(Object.values(ORDER_SALE_STATUS), [
            ORDER_SALE_STATUS.DONE,
            ORDER_SALE_STATUS.RETURN,
          ])
        ),
      };

      const foundOrder = await Order.findOne({
        where: { id: order_id },
        attributes: ["id", "order_status", "order_type"],
        include: [
          {
            model: CustSupp,
            attributes: ["id", "user_id"],
            include: [{ model: User, attributes: ["id"] }],
          },
        ],
      });

      const order_type = foundOrder.dataValues.order_type;

      const handleCheckAcceptUpdate = () => {
        let isOK: boolean = false;
        let messages: string[] = [];
        const EXCEPTION_UPDATE_STATUS_LIST: string[] = Array.from(
          new Set([
            ORDER_IMPORT_STATUS.DONE,
            ORDER_SALE_STATUS.DONE,
            ORDER_IMPORT_STATUS.RETURN,
            ORDER_SALE_STATUS.RETURN,
          ])
        );

        const argMissArr = checkMissPropertyInObjectBaseOnValueCondition(
          { update_status },
          [undefined]
        );

        isOK =
          isEmpty(argMissArr) &&
          !EXCEPTION_UPDATE_STATUS_LIST.includes(update_status) &&
          ORDER_STATUS_BASE_ON_ORDER_TYPE[order_type].includes(update_status);

        if (!isEmpty(argMissArr)) {
          messages.push(`${argMissArr.join(",")} is required!`);
        }
        if (EXCEPTION_UPDATE_STATUS_LIST.includes(update_status)) {
          messages = [
            `update order status value can't be: ${EXCEPTION_UPDATE_STATUS_LIST}`,
          ];
        }

        if (
          !ORDER_STATUS_BASE_ON_ORDER_TYPE[order_type].includes(update_status)
        ) {
          messages.push(
            `update order status value must be: ${ORDER_STATUS_BASE_ON_ORDER_TYPE[
              order_type
            ].join(",")}`
          );
        }

        return {
          isOK,
          messages,
        };
      };

      if (handleCheckAcceptUpdate().isOK) {
        foundOrder.order_status = update_status;
        const res = await foundOrder.save();
        console.log("update result:::", res);
        return {
          statusCode: STATUS_CODE.STATUS_CODE_200,
          data: RestFullAPI.onSuccess(STATUS_MESSAGE.SUCCESS),
        };
      } else {
        return {
          statusCode: STATUS_CODE.STATUS_CODE_406,
          data: RestFullAPI.onSuccess(
            STATUS_MESSAGE.NOT_ACCEPTABLE,
            handleCheckAcceptUpdate().messages
          ),
        };
      }
    } catch (err) {
      return {
        statusCode: STATUS_CODE.STATUS_CODE_500,
        data: handleError(err as Error),
      };
    }
  }
}

export default OrderServices;
