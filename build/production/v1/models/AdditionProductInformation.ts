"use strict";
import { Model } from "sequelize";
<<<<<<<< HEAD:build/production/v1/models/AdditionProductInformation.ts
import { AdditionProductInformationAttributes } from "@/src/api/v1/ts/interfaces/app_interfaces";
========
import { AdditionProductInformationAttributes } from "@/src/api/v2/ts/interfaces/app_interfaces";
>>>>>>>> dev/api-v2:src/api/v2/models/AdditionProductInformation.ts
export default (sequelize: any, DataTypes: any) => {
  class AdditionProductInformation
    extends Model<AdditionProductInformationAttributes>
    implements AdditionProductInformationAttributes
  {
    id!: string;
    product_id!: string;
    type_id!: string;
    brand_id!: string;

    static associate({ Type, Brand, Products, ProductTagList }: any) {
      AdditionProductInformation.belongsTo(Type, {
        foreignKey: "type_id",
      });
      AdditionProductInformation.belongsTo(Brand, {
        foreignKey: "brand_id",
      });
      AdditionProductInformation.belongsTo(Products, {
        foreignKey: "product_id",
      });
      AdditionProductInformation.hasMany(ProductTagList, {
        foreignKey: "addition_product_information_id",
        as: "Product_Tag_List",
      });
    }
  }
  AdditionProductInformation.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      product_id: {
        type: DataTypes.UUID,
      },
      type_id: {
        type: DataTypes.UUID,
      },
      brand_id: {
        type: DataTypes.UUID,
      },
    },
    {
      sequelize,
      modelName: "AdditionProductInformation",
    }
  );
  return AdditionProductInformation;
};
