"use strict";
import { Model } from "sequelize";
import { IRolePermission } from "../dto/input/rolePermission/rolePermission.interface";

export default (sequelize: any, DataTypes: any) => {
  class RolePermission
    extends Model<IRolePermission>
    implements IRolePermission
  {
    id!: string;
    role_id!: string;
    role_permission_description!: string;
    isDelete!: boolean;
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({}: any) {}
  }
  RolePermission.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      role_id: {
        type: DataTypes.UUID,
      },
      role_permission_description: {
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
      modelName: "RolePermission",
      timestamps: true,
    }
  );
  return RolePermission;
};
