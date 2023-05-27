"use strict";
import { Model } from "sequelize";
import { OrderAttributes } from "@/src/ts/interfaces/app_interfaces";

export default (sequelize: any, DataTypes: any) => {
  class Order extends Model<OrderAttributes> implements OrderAttributes {
    id!: string;
    agency_branch_id!: string;
    shipper_id!: string;
    payment_id!: string;
    staff_id!: string;
    supplier_id!: string;
    order_type!: string;
    order_code!: string;
    order_delivery_date!: Date;
    order_status!: string;
    order_note!: string;
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({
      Shipper,
      Payment,
      OrderTag,
      Customer,
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
      Order.belongsTo(Customer, {
        foreignKey: "supplier_id",
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
      supplier_id: { type: DataTypes.UUID },
      order_type: { type: DataTypes.STRING },
      order_code: { type: DataTypes.STRING },
      order_status: { type: DataTypes.STRING },
      order_note: { type: DataTypes.STRING },
      order_delivery_date: { type: DataTypes.DATE },
    },
    {
      sequelize,
      modelName: "Order",
    }
  );
  return Order;
};
