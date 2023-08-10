"use strict";
import { Model } from "sequelize";
<<<<<<< HEAD
<<<<<<<< HEAD:build/production/v1/models/Shipper.ts
import { ShipperAttributes } from "@/src/api/v1/ts/interfaces/app_interfaces";
========
import { ShipperAttributes } from "@/src/api/v2/ts/interfaces/app_interfaces";
>>>>>>>> dev/api-v2:src/api/v2/models/Shipper.ts
=======
import { ShipperAttributes } from "@/src/api/v2/ts/interfaces/entities_interfaces";
>>>>>>> dev/api-v2

export default (sequelize: any, DataTypes: any) => {
  class Shipper extends Model<ShipperAttributes> implements ShipperAttributes {
    id!: string;
    shipper_unit!: string;
    shipper_phone!: string;
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ AdditionProductInformation, Order }: any) {
      Shipper.hasOne(AdditionProductInformation, {
        foreignKey: "brand_id",
      });
      Shipper.hasMany(Order, {
        foreignKey: "shipper_id",
      });
    }
  }
  Shipper.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      shipper_unit: {
        type: DataTypes.STRING,
      },
      shipper_phone: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "Shipper",
    }
  );
  return Shipper;
};
