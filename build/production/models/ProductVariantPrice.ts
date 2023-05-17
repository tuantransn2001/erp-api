"use strict";
import { Model } from "sequelize";
import { ProductVariantPriceAttributes } from "@/src/ts/interfaces/app_interfaces";

export default (sequelize: any, DataTypes: any) => {
  class ProductVariantPrice
    extends Model<ProductVariantPriceAttributes>
    implements ProductVariantPriceAttributes
  {
    id!: string;
    product_variant_id!: string;
    price_id!: string;
    price_value!: string;
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ ProductVariantDetail, Price }: any) {
      ProductVariantPrice.belongsTo(ProductVariantDetail, {
        foreignKey: "product_variant_id",
        as: "Variant_Prices",
      });
      ProductVariantPrice.belongsTo(Price, {
        foreignKey: "price_id",
      });
    }
  }
  ProductVariantPrice.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      product_variant_id: {
        type: DataTypes.UUID,
      },
      price_id: {
        type: DataTypes.UUID,
      },
      price_value: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "ProductVariantPrice",
    }
  );
  return ProductVariantPrice;
};
