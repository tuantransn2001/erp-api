"use strict";
import { Model } from "sequelize";
<<<<<<< HEAD
<<<<<<<< HEAD:build/production/v1/models/UserAddress.ts
import { UserAddressAttributes } from "@/src/api/v1/ts/interfaces/app_interfaces";
========
import { UserAddressAttributes } from "@/src/api/v2/ts/interfaces/app_interfaces";
>>>>>>>> dev/api-v2:src/api/v2/models/UserAddress.ts
=======
import { UserAddressAttributes } from "@/src/api/v2/ts/interfaces/entities_interfaces";
>>>>>>> dev/api-v2

export default (sequelize: any, DataTypes: any) => {
  class UserAddress
    extends Model<UserAddressAttributes>
    implements UserAddressAttributes
  {
    id!: string;
    user_id!: string;
    user_province!: string;
    user_district!: string;
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
    },
    {
      sequelize,
      modelName: "UserAddress",
    }
  );
  return UserAddress;
};
