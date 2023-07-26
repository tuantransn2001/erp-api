"use strict";
import { Model } from "sequelize";
<<<<<<<< HEAD:build/production/v1/models/Brand.ts
import { BrandAttributes } from "@/src/api/v1/ts/interfaces/app_interfaces";
========
import { BrandAttributes } from "@/src/api/v2/ts/interfaces/app_interfaces";
>>>>>>>> dev/api-v2:src/api/v2/models/Brand.ts

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
