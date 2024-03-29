"use strict";
import { Model } from "sequelize";
import { IPrice } from "../dto/input/price/price.interface";

export default (sequelize: any, DataTypes: any) => {
  class Price extends Model<IPrice> implements IPrice {
    id!: string;
    price_type!: string;
    isDelete!: boolean;
    price_description!: string;
    isImportDefault!: boolean;
    isSellDefault!: boolean;
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({}: any) {}
  }
  Price.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      price_type: {
        type: DataTypes.STRING,
      },
      price_description: {
        type: DataTypes.STRING,
      },
      isImportDefault: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isSellDefault: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isDelete: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Price",
      timestamps: true,
    }
  );
  return Price;
};
