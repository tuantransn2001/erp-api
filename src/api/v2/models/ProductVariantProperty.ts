"use strict";
import { Model } from "sequelize";
<<<<<<< HEAD
<<<<<<<< HEAD:build/production/v1/models/ProductVariantProperty.ts
import { ProductVariantPropertyAttributes } from "@/src/api/v1/ts/interfaces/app_interfaces";
========
import { ProductVariantPropertyAttributes } from "@/src/api/v2/ts/interfaces/app_interfaces";
>>>>>>>> dev/api-v2:src/api/v2/models/ProductVariantProperty.ts
=======
import { ProductVariantPropertyAttributes } from "@/src/api/v2/ts/interfaces/entities_interfaces";
>>>>>>> dev/api-v2

export default (sequelize: any, DataTypes: any) => {
  class ProductVariantProperty
    extends Model<ProductVariantPropertyAttributes>
    implements ProductVariantPropertyAttributes
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
    },
    {
      sequelize,
      modelName: "ProductVariantProperty",
    }
  );
  return ProductVariantProperty;
};
