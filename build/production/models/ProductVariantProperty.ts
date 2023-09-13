"use strict";
import { Model } from "sequelize";
import { IProductVariantProperty } from "../dto/input/productVariantProperty/productVariantProperty.interface";

export default (sequelize: any, DataTypes: any) => {
  class ProductVariantProperty
    extends Model<IProductVariantProperty>
    implements IProductVariantProperty
  {
    id!: string;
    product_variant_id!: string;
    product_variant_property_key!: string;
    product_variant_property_value!: string;
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ ProductVariantDetail }: any) {
      ProductVariantProperty.belongsTo(ProductVariantDetail, {
        foreignKey: "product_variant_id",
        as: "Properties",
      });
    }
  }
  ProductVariantProperty.init(
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
      product_variant_property_key: {
        type: DataTypes.STRING,
      },
      product_variant_property_value: {
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
      modelName: "ProductVariantProperty",
      timestamps: true,
    }
  );
  return ProductVariantProperty;
};
