"use strict";
import { Model } from "sequelize";
<<<<<<< HEAD
<<<<<<<< HEAD:build/production/v1/models/ProductTagList.ts
import { ProductTagItemAttributes } from "@/src/api/v1/ts/interfaces/app_interfaces";
========
import { ProductTagItemAttributes } from "@/src/api/v2/ts/interfaces/app_interfaces";
>>>>>>>> dev/api-v2:src/api/v2/models/ProductTagList.ts
=======
import { ProductTagItemAttributes } from "@/src/api/v2/ts/interfaces/entities_interfaces";
>>>>>>> dev/api-v2

export default (sequelize: any, DataTypes: any) => {
  class ProductTagList
    extends Model<ProductTagItemAttributes>
    implements ProductTagItemAttributes
  {
    id!: string;
    tag_id!: string;
    addition_product_information_id!: string;

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
    },
    {
      sequelize,
      modelName: "ProductTagList",
    }
  );
  return ProductTagList;
};
