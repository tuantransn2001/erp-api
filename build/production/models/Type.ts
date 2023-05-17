"use strict";
import { Model } from "sequelize";
import { TypeAttributes } from "@/src/ts/interfaces/app_interfaces";

export default (sequelize: any, DataTypes: any) => {
  class Type extends Model<TypeAttributes> implements TypeAttributes {
    id!: string;
    type_title!: string;
    type_description!: string;
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ AdditionProductInformation }: any) {
      Type.hasOne(AdditionProductInformation, {
        foreignKey: "type_id",
      });
    }
  }
  Type.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      type_title: {
        type: DataTypes.STRING,
      },
      type_description: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "Type",
    }
  );
  return Type;
};
