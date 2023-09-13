"use strict";
import { Model } from "sequelize";
import { IStaff } from "../dto/input/staff/staff.interface";
export default (sequelize: any, DataTypes: any) => {
  class Staff extends Model<IStaff> implements IStaff {
    id!: string;
    user_id!: string;
    staff_status!: string;
    staff_birthday!: string;
    note_about_staff!: string;
    staff_gender!: boolean;
    isDelete!: boolean;
    isAllowViewImportNWholesalePrice!: boolean;
    isAllowViewShippingPrice!: boolean;
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, CustSupp, Order }: any) {
      Staff.belongsTo(User, {
        foreignKey: "user_id",
      });
      Staff.hasMany(CustSupp, {
        foreignKey: "staff_id",
      });
      Staff.hasMany(Order, {
        foreignKey: "staff_id",
      });
    }
  }
  Staff.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      user_id: DataTypes.UUID,
      staff_status: DataTypes.STRING,
      staff_birthday: DataTypes.DATE,
      note_about_staff: DataTypes.STRING,
      staff_gender: DataTypes.BOOLEAN,
      isAllowViewImportNWholesalePrice: DataTypes.BOOLEAN,
      isAllowViewShippingPrice: DataTypes.BOOLEAN,
      isDelete: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Staff",
      timestamps: true,
    }
  );
  return Staff;
};
