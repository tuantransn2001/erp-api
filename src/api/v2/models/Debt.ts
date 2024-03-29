"use strict";
import { Model } from "sequelize";
import { IDebt } from "../dto/input/debt/debt.interface";

export default (sequelize: any, DataTypes: any) => {
  class Debt extends Model<IDebt> implements IDebt {
    id!: string;
    user_id!: string;
    source_id!: string;
    debt_note!: string;
    change_debt!: string;
    isDelete!: boolean;
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
      source_id: {
        // ? THIS IS SOURCE WHICH DEBT PAID FOR [ ORDER ]
        type: DataTypes.UUID,
      },
      change_debt: {
        type: DataTypes.STRING,
      },
      debt_amount: {
        type: DataTypes.STRING,
      },
      debt_note: {
        type: DataTypes.STRING,
      },
      action: {
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
      modelName: "Debt",
      timestamps: true,
    }
  );
  return Debt;
};
