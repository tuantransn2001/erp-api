"use strict";
import { Model } from "sequelize";
import { DebtAttributes } from "@/src/ts/interfaces/app_interfaces";

export default (sequelize: any, DataTypes: any) => {
  class Debt extends Model<DebtAttributes> implements DebtAttributes {
    id!: string;
    user_id!: string;
    change_debt!: string;
    debt_amount!: string;
    action!: string;
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User }: any) {
      Debt.belongsTo(User, {
        foreignKey: "user_id",
      });
    }
  }
  Debt.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      user_id: {
        type: DataTypes.UUID,
      },
      change_debt: {
        type: DataTypes.STRING,
      },
      debt_amount: {
        type: DataTypes.STRING,
      },
      action: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "Debt",
    }
  );
  return Debt;
};
