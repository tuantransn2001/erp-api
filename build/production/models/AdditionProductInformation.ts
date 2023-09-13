"use strict";
import { Model } from "sequelize";
import { IAdditionProductInformation } from "@/src/api/v2/dto/input/additionProductInformation/additionProductInformation.interface";
export default (sequelize: any, DataTypes: any) => {
  class AdditionProductInformation
    extends Model<IAdditionProductInformation>
    implements IAdditionProductInformation
  {
    id!: string;
    product_id!: string;
    type_id!: string;
    brand_id!: string;
    isDeleted!: boolean;
    createdAt!: Date;
    updateAt!: Date;

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
      isDelete: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "AdditionProductInformation",
      timestamps: true,
    }
  );
  return AdditionProductInformation;
};
