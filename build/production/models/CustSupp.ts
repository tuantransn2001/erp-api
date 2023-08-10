"use strict";
import { Model } from "sequelize";
import { CustSuppAttributes } from "@/src/api/v2/ts/interfaces/entities_interfaces";

export default (sequelize: any, DataTypes: any) => {
  class CustSupp
    extends Model<CustSuppAttributes>
    implements CustSuppAttributes
  {
    id!: string;
    user_id!: string;
    staff_id!: string | null;
    status!: string;
    staff_in_charge_note!: string;
    static associate({ User, Staff, Order, CustSuppTag }: any) {
      CustSupp.belongsTo(User, {
        foreignKey: "user_id",
      });
      CustSupp.belongsTo(Staff, { foreignKey: "staff_id" });
      CustSupp.hasMany(Order, {
        foreignKey: "custSupp",
      });
      CustSupp.hasMany(CustSuppTag, {
        foreignKey: "custSupp_id",
      });
    }
  }
  CustSupp.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      staff_id: { type: DataTypes.UUID, allowNull: true },
      staff_in_charge_note: { type: DataTypes.STRING, allowNull: true },
      user_id: { type: DataTypes.UUID },
      status: { type: DataTypes.STRING },
    },
    {
      sequelize,
      modelName: "CustSupp",
    }
  );
  return CustSupp;
};
