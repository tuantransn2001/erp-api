"use strict";
import { v4 as uuidv4 } from "uuid";
import { Model } from "sequelize";
import { UserAttributes } from "@/src/api/v2/ts/interfaces/entities_interfaces";
import { handleGenerateRandomCode } from "../utils/generateCode/generateCode";
export default (sequelize: any, DataTypes: any) => {
  class User extends Model<UserAttributes> implements UserAttributes {
    id!: string;
    user_code!: string;
    user_phone!: string;
    user_email!: string;
    user_password!: string;
    user_name!: string;
    user_type!: string;
    isDelete!: boolean;
    static associate({
      CustSupp,
      Staff,
      UserAddress,
      Debt,
      Role,
      UserRole,
    }: any) {
      User.hasOne(CustSupp, {
        foreignKey: "user_id",
      });
      User.hasOne(Staff, {
        foreignKey: "user_id",
      });
      User.hasOne(Debt, {
        foreignKey: "user_id",
      });
      User.hasMany(UserAddress, {
        foreignKey: "user_id",
      });
      User.hasMany(Role, {
        foreignKey: "user_id",
      });
      User.hasMany(UserRole, {
        foreignKey: "user_id",
      });
    }
  }
  User.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: uuidv4(),
      },
      user_code: {
        type: DataTypes.STRING,
        defaultValue: handleGenerateRandomCode(),
      },
      user_phone: {
        type: DataTypes.STRING,
      },
      user_email: {
        type: DataTypes.STRING,
      },
      user_password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      user_name: {
        type: DataTypes.STRING,
      },
      user_type: {
        type: DataTypes.STRING,
      },
      isDelete: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
