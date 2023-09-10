"use strict";
import { Model } from "sequelize";
import { UserAddressAttributes } from "@/src/api/v2/ts/interfaces/entities_interfaces";

export default (sequelize: any, DataTypes: any) => {
  class UserAddress
    extends Model<UserAddressAttributes>
    implements UserAddressAttributes
  {
    id!: string;
    user_id!: string;
    user_province!: string;
    user_district!: string;
    isDelete!: boolean;
    user_specific_address!: string;
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User }: any) {
      UserAddress.belongsTo(User, {
        foreignKey: "user_id",
      });
    }
  }
  UserAddress.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      user_id: {
        type: DataTypes.UUID,
      },
      user_province: { type: DataTypes.STRING },
      user_district: { type: DataTypes.STRING },
      user_specific_address: { type: DataTypes.STRING },
      isDelete: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      sequelize,
      modelName: "UserAddress",
    }
  );
  return UserAddress;
};
