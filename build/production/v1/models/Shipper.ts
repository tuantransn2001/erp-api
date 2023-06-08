"use strict";
import { Model } from "sequelize";
import { ShipperAttributes } from "@/src/api/v1/ts/interfaces/app_interfaces";

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
