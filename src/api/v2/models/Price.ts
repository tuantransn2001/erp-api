"use strict";
import { Model } from "sequelize";
<<<<<<< HEAD
<<<<<<<< HEAD:build/production/v1/models/Price.ts
import { PriceAttributes } from "@/src/api/v1/ts/interfaces/app_interfaces";
========
import { PriceAttributes } from "@/src/api/v2/ts/interfaces/app_interfaces";
>>>>>>>> dev/api-v2:src/api/v2/models/Price.ts
=======
import { PriceAttributes } from "@/src/api/v2/ts/interfaces/entities_interfaces";
>>>>>>> dev/api-v2

export default (sequelize: any, DataTypes: any) => {
  class Price extends Model<PriceAttributes> implements PriceAttributes {
    id!: string;
    price_type!: string;
    price_description!: string;
    isImportDefault!: boolean;
    isSellDefault!: boolean;
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({}: any) {}
  }
  Price.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      price_type: {
        type: DataTypes.STRING,
      },
      price_description: {
        type: DataTypes.STRING,
      },
      isImportDefault: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isSellDefault: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Price",
    }
  );
  return Price;
};
