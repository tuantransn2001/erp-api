"use strict";
import { Model } from "sequelize";
import { IOrder } from "../dto/input/order/order.interface";

export default (sequelize: any, DataTypes: any) => {
  class Order extends Model<IOrder> implements IOrder {
    id!: string;
    agency_branch_id!: string;
    shipper_id!: string;
    payment_id!: string;
    staff_id!: string;
    custSupp_id!: string;
    order_type!: string;
    order_code!: string;
    order_delivery_date!: string;
    order_status!: string;
    order_note!: string;
    order_total!: number;
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({
      Shipper,
      Payment,
      OrderTag,
      CustSupp,
      OrderProductList,
      AgencyBranch,
      Staff,
    }: any) {
      Order.belongsTo(Shipper, {
        foreignKey: "shipper_id",
      });
      Order.belongsTo(Payment, {
        foreignKey: "payment_id",
      });
      Order.hasMany(OrderTag, {
        foreignKey: "order_id",
      });
      Order.belongsTo(CustSupp, {
        foreignKey: "custSupp_id",
      });
      Order.hasMany(OrderProductList, {
        foreignKey: "order_id",
      });
      Order.belongsTo(AgencyBranch, {
        foreignKey: "agency_branch_id",
      });
      Order.belongsTo(Staff, {
        foreignKey: "staff_id",
      });
    }
  }
  Order.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      agency_branch_id: { type: DataTypes.UUID },
      shipper_id: { type: DataTypes.UUID },
      payment_id: { type: DataTypes.UUID },
      staff_id: { type: DataTypes.UUID },
      custSupp_id: { type: DataTypes.UUID },
      order_type: { type: DataTypes.STRING },
      order_code: { type: DataTypes.STRING },
      order_status: { type: DataTypes.STRING },
      order_note: { type: DataTypes.STRING },
      order_total: { type: DataTypes.DOUBLE },
      order_delivery_date: { type: DataTypes.STRING },
      isDelete: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Order",
      timestamps: true,
    }
  );
  return Order;
};
