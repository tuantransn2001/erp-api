"use strict";
import { Model } from "sequelize";
<<<<<<< HEAD
<<<<<<<< HEAD:build/production/v1/models/Staff.ts
import { StaffAttributes } from "@/src/api/v1/ts/interfaces/app_interfaces";
========
import { StaffAttributes } from "@/src/api/v2/ts/interfaces/app_interfaces";
>>>>>>>> dev/api-v2:src/api/v2/models/Staff.ts
=======
import { StaffAttributes } from "@/src/api/v2/ts/interfaces/entities_interfaces";
>>>>>>> dev/api-v2

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
    static associate({ User, CustSupp, StaffRole, Order }: any) {
      Staff.belongsTo(User, {
        foreignKey: "user_id",
      });
      Staff.hasMany(CustSupp, {
        foreignKey: "staff_id",
      });
      Staff.hasMany(StaffRole, {
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
    },
    {
      sequelize,
      modelName: "Staff",
    }
  );
  return Staff;
};
