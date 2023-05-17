"use strict";
import { Model } from "sequelize";
import { ProductVariantDetailAttributes } from "@/src/ts/interfaces/app_interfaces";
export default (sequelize: any, DataTypes: any) => {
  class ProductVariantDetail
    extends Model<ProductVariantDetailAttributes>
    implements ProductVariantDetailAttributes
  {
    id!: string;
    product_id!: string;
    product_variant_name!: string;
    product_variant_SKU!: string;
    product_variant_barcode!: string;
    product_weight!: string;
    product_weight_calculator_unit!: string;
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({
      Products,
      ProductVariantPrice,
      ProductVariantProperty,
      OrderProductList,
      AgencyBranchProductList,
    }: any) {
      ProductVariantDetail.belongsTo(Products, {
        foreignKey: "product_id",
        as: "Variants",
      });
      ProductVariantDetail.hasMany(ProductVariantPrice, {
        foreignKey: "product_variant_id",
        as: "Variant_Prices",
      });
      ProductVariantDetail.hasMany(ProductVariantProperty, {
        foreignKey: "product_variant_id",
        as: "Properties",
      });
      ProductVariantDetail.hasMany(OrderProductList, {
        foreignKey: "product_variant_id",
      });
      ProductVariantDetail.hasMany(AgencyBranchProductList, {
        foreignKey: "product_variant_id",
      });
    }
  }
  ProductVariantDetail.init(
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
      product_variant_name: {
        type: DataTypes.STRING,
      },
      product_variant_SKU: {
        type: DataTypes.STRING,
      },
      product_variant_barcode: {
        type: DataTypes.STRING,
      },
      product_weight: {
        type: DataTypes.STRING,
      },
      product_weight_calculator_unit: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "ProductVariantDetail",
    }
  );
  return ProductVariantDetail;
};
