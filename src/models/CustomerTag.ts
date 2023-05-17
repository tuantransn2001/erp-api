"use strict";
import { Model } from "sequelize";
import { CustomerTagAttributes } from "@/src/ts/interfaces/app_interfaces";

export default (sequelize: any, DataTypes: any) => {
  class CustomerTag
    extends Model<CustomerTagAttributes>
    implements CustomerTagAttributes
  {
    id!: string;
    customer_id!: string;
    tag_id!: string;
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Tag, Customer }: any) {
      CustomerTag.belongsTo(Tag, {
        foreignKey: "tag_id",
      });
      CustomerTag.belongsTo(Customer, {
        foreignKey: "customer_id",
      });
    }
  }
  CustomerTag.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      customer_id: { type: DataTypes.UUID },
      tag_id: { type: DataTypes.UUID },
    },
    {
      sequelize,
      modelName: "CustomerTag",
    }
  );
  return CustomerTag;
};
