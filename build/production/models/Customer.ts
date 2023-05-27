"use strict";
import { Model } from "sequelize";
import { CustomerAttributes } from "@/src/ts/interfaces/app_interfaces";

export default (sequelize: any, DataTypes: any) => {
  class Customer
    extends Model<CustomerAttributes>
    implements CustomerAttributes
  {
    id!: string;
    user_id!: string;
    staff_id!: string | null;
    customer_status!: string;
    staff_in_charge_note!: string;
    static associate({ User, Staff, Order, CustomerTag }: any) {
      Customer.belongsTo(User, {
        foreignKey: "user_id",
      });
      Customer.belongsTo(Staff, { foreignKey: "staff_id" });
      Customer.hasMany(Order, {
        foreignKey: "supplier_id",
      });
      Customer.hasMany(CustomerTag, {
        foreignKey: "customer_id",
      });
    }
  }
  Customer.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      staff_id: { type: DataTypes.UUID, allowNull: true },
      user_id: { type: DataTypes.UUID },
      customer_status: { type: DataTypes.STRING },
      staff_in_charge_note: { type: DataTypes.STRING },
    },
    {
      sequelize,
      modelName: "Customer",
    }
  );
  return Customer;
};
