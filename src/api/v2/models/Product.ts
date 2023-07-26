"use strict";
import { Model } from "sequelize";
<<<<<<<< HEAD:build/production/v1/models/Product.ts
import { ProductAttributes } from "@/src/api/v1/ts/interfaces/app_interfaces";
========
import { ProductAttributes } from "@/src/api/v2/ts/interfaces/app_interfaces";
>>>>>>>> dev/api-v2:src/api/v2/models/Product.ts
export default (sequelize: any, DataTypes: any) => {
  class Products extends Model<ProductAttributes> implements ProductAttributes {
    id!: string;
    order_product_item_id!: string;
    agency_branch_product_item_id!: string;
    product_name!: string;
    product_classify!: string;
    product_SKU!: string;
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
    },
    {
      sequelize,
      modelName: "Products",
    }
  );
  return Products;
};
