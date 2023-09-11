"use strict";
import { Model } from "sequelize";
import { IProductTag } from "../dto/input/productTag/productTag.interface";

export default (sequelize: any, DataTypes: any) => {
  class ProductTagList extends Model<IProductTag> implements IProductTag {
    id!: string;
    tag_id!: string;
    addition_product_information_id!: string;
    isDelete!: boolean;

    static associate({ Tag, AdditionProductInformation }: any) {
      ProductTagList.belongsTo(Tag, {
        foreignKey: "tag_id",
      });
      ProductTagList.belongsTo(AdditionProductInformation, {
        foreignKey: "addition_product_information_id",
        as: "Product_Tag_List",
      });
    }
  }
  ProductTagList.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      tag_id: {
        type: DataTypes.UUID,
      },
      addition_product_information_id: {
        type: DataTypes.UUID,
      },
      isDelete: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "ProductTagList",
      timestamps: true,
    }
  );
  return ProductTagList;
};
