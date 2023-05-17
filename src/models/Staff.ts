"use strict";
import { Model } from "sequelize";
import { StaffAttributes } from "@/src/ts/interfaces/app_interfaces";

export default (sequelize: any, DataTypes: any) => {
  class Staff extends Model<StaffAttributes> implements StaffAttributes {
    id!: string;
    user_id!: string;
    staff_status!: string;
    staff_birthday!: Date;
    note_about_staff!: string;
    staff_gender!: boolean;
    isAllowViewImportNWholesalePrice!: boolean;
    isAllowViewShippingPrice!: boolean;
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, StaffRole, Customer }: any) {
      Staff.hasMany(StaffRole, {
        foreignKey: "staff_id",
      });
      Staff.belongsTo(User, {
        foreignKey: "user_id",
      });
      Staff.hasMany(Customer, {
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
    },
    {
      sequelize,
      modelName: "Staff",
    }
  );
  return Staff;
};
