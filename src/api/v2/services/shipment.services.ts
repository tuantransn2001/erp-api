import { STATUS_CODE } from "../ts/enums/api_enums";
import { handleError } from "../utils/handleError/handleError";
import { ORDER_TYPE } from "../ts/enums/order_enum";
import db from "../models";
import { GetEntitiesFormatPayload } from "../ts/types/common";
import { ENTITIES_FORMAT_TYPE } from "../ts/enums/app_enums";
import {
  CustSuppAttributes,
  OrderAttributes,
  ShipperAttributes,
  UserAttributes,
} from "../ts/interfaces/entities_interfaces";
const { Order, CustSupp, User, Shipper } = db;

interface CustSuppQuery extends CustSuppAttributes {
  User: { dataValues: UserAttributes };
}

interface OrderQueryAttributes extends OrderAttributes {
  Shipper: { dataValues: ShipperAttributes };
  CustSupp: { dataValues: CustSuppQuery };
}

interface ShipmentOrderAttributes {
  dataValues: OrderQueryAttributes;
}

class ShipmentServices {
  private static shipmentOrderList: ShipmentOrderAttributes[];

  private static getOrderInCludeShipmentFormat({
    format_type,
  }: GetEntitiesFormatPayload) {
    switch (format_type) {
      case ENTITIES_FORMAT_TYPE.P_LIST: {
        return ShipmentServices.shipmentOrderList.map((shipmentOrder) => {
          const { id, order_code, order_status } = shipmentOrder.dataValues;
          const { id: shipper_id, shipper_unit: unit } =
            shipmentOrder.dataValues.Shipper.dataValues;
          const { id: customer_id } =
            shipmentOrder.dataValues.CustSupp.dataValues;
          const {
            id: user_id,
            user_name,
            user_phone,
          } = shipmentOrder.dataValues.CustSupp.dataValues.User.dataValues;
          return {
            id,
            order_code,
            order_status,
            shipper: { id: shipper_id, unit },
            customer: {
              user_id,
              id: customer_id,
              name: user_name,
              phone: user_phone,
            },
          };
        });
      }
      default: {
        return {
          message: `format_type: ${format_type} is in-valid! ${Object.values(
            ENTITIES_FORMAT_TYPE
          )}`,
        };
      }
    }
  }

  public static async getAllOrderSale() {
    try {
      const orderList = await Order.findAll({
        where: {
          order_type: ORDER_TYPE.SALE,
        },
        attributes: ["id", "order_status", "order_code", "createdAt"],
        include: [
          {
            model: Shipper,
            attributes: ["id", "shipper_unit"],
          },
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
        ],
      });
      ShipmentServices.shipmentOrderList = orderList;
      return {
        statusCode: STATUS_CODE.STATUS_CODE_200,
        data: ShipmentServices.getOrderInCludeShipmentFormat({
          format_type: ENTITIES_FORMAT_TYPE.P_LIST,
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

export default ShipmentServices;
