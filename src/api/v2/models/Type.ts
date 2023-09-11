"use strict";
import { Model } from "sequelize";
import { IType } from "../dto/input/type/type.interface";
export default (sequelize: any, DataTypes: any) => {
  class Type extends Model<IType> implements IType {
    id!: string;
    type_title!: string;
    type_description!: string;
    isDelete!: boolean;
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
      isDelete: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Type",
      timestamps: true,
    }
  );
  return Type;
};
