"use strict";
import { Model } from "sequelize";
<<<<<<< HEAD
<<<<<<<< HEAD:build/production/v1/models/Orderproductlist.ts
import { OrderProductListAttributes } from "@/src/api/v1/ts/interfaces/app_interfaces";
========
import { OrderProductListAttributes } from "@/src/api/v2/ts/interfaces/app_interfaces";
>>>>>>>> dev/api-v2:src/api/v2/models/Orderproductlist.ts
=======
import { OrderProductListAttributes } from "@/src/api/v2/ts/interfaces/entities_interfaces";
>>>>>>> dev/api-v2

export default (sequelize: any, DataTypes: any) => {
  class OrderProductList
    extends Model<OrderProductListAttributes>
    implements OrderProductListAttributes
  {
    id!: string;
    order_id!: string;
    product_variant_id!: string;
    product_amount!: number;
    product_discount!: number;
    product_price!: number;
    product_unit!: string;
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ ProductVariantDetail, Order }: any) {
      OrderProductList.belongsTo(ProductVariantDetail, {
        foreignKey: "product_variant_id",
      });
      OrderProductList.belongsTo(Order, {
        foreignKey: "order_id",
      });
    }
  }
  OrderProductList.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      order_id: {
        type: DataTypes.UUID,
      },
      product_variant_id: {
        type: DataTypes.UUID,
      },
      product_amount: {
        type: DataTypes.INTEGER,
      },
      product_discount: {
        type: DataTypes.INTEGER,
      },
      product_unit: {
        type: DataTypes.STRING,
      },
      product_price: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "OrderProductList",
    }
  );
  return OrderProductList;
};
