"use strict";
import { Model } from "sequelize";
import { IShipper } from "../dto/input/shipper/shipper.interface";

export default (sequelize: any, DataTypes: any) => {
  class Shipper extends Model<IShipper> implements IShipper {
    id!: string;
    shipper_unit!: string;
    shipper_phone!: string;
    isDelete!: boolean;
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
      isDelete: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Shipper",
      timestamps: true,
    }
  );
  return Shipper;
};
