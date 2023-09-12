"use strict";
import { Model } from "sequelize";
import { IProduct } from "../dto/input/product/product.interface";
export default (sequelize: any, DataTypes: any) => {
  class Products extends Model<IProduct> implements IProduct {
    id!: string;
    order_product_item_id!: string;
    agency_branch_product_item_id!: string;
    product_name!: string;
    product_classify!: string;
    product_SKU!: string;
    isDelete!: boolean;
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({
      AdditionProductInformation,
      ProductVariantDetail,
    }: any) {
      Products.hasOne(AdditionProductInformation, {
        foreignKey: "product_id",
      });
      Products.hasMany(ProductVariantDetail, {
        foreignKey: "product_id",
        as: "Variants",
      });
    }
  }
  Products.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      order_product_item_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      agency_branch_product_item_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      product_name: {
        type: DataTypes.STRING,
      },

      product_classify: {
        type: DataTypes.STRING,
      },
      product_SKU: {
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
      modelName: "Products",
      timestamps: true,
    }
  );
  return Products;
};
