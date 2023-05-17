"use strict";
import { Model } from "sequelize";
import { OrderTagAttributes } from "@/src/ts/interfaces/app_interfaces";

export default (sequelize: any, DataTypes: any) => {
  class OrderTag
    extends Model<OrderTagAttributes>
    implements OrderTagAttributes
  {
    id!: string;
    order_id!: string;
    tag_id!: string;
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Tag, Order }: any) {
      OrderTag.belongsTo(Tag, {
        foreignKey: "tag_id",
      });
      OrderTag.belongsTo(Order, {
        foreignKey: "order_id",
      });
    }
  }
  OrderTag.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      order_id: { type: DataTypes.UUID },
      tag_id: { type: DataTypes.UUID },
    },
    {
      sequelize,
      modelName: "OrderTag",
    }
  );
  return OrderTag;
};
