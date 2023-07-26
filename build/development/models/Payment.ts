"use strict";
import { Model } from "sequelize";
<<<<<<<< HEAD:build/production/v1/models/Payment.ts
import { PaymentAttributes } from "@/src/api/v1/ts/interfaces/app_interfaces";
========
import { PaymentAttributes } from "@/src/api/v2/ts/interfaces/app_interfaces";
>>>>>>>> dev/api-v2:src/api/v2/models/Payment.ts

export default (sequelize: any, DataTypes: any) => {
  class Payment extends Model<PaymentAttributes> implements PaymentAttributes {
    id!: string;
    payment_type!: string;
    payment_description!: string;
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Order }: any) {
      Payment.hasMany(Order, {
        foreignKey: "payment_id",
      });
    }
  }
  Payment.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      payment_type: {
        type: DataTypes.STRING,
      },
      payment_description: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "Payment",
    }
  );
  return Payment;
};
