"use strict";
import { Model } from "sequelize";
import { BrandAttributes } from "@/src/ts/interfaces/app_interfaces";

export default (sequelize: any, DataTypes: any) => {
  class Brand extends Model<BrandAttributes> implements BrandAttributes {
    id!: string;
    brand_title!: string;
    brand_description!: string;
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ AdditionProductInformation }: any) {
      Brand.hasOne(AdditionProductInformation, {
        foreignKey: "brand_id",
      });
    }
  }
  Brand.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      brand_title: {
        type: DataTypes.STRING,
      },
      brand_description: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "Brand",
    }
  );
  return Brand;
};
