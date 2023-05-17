"use strict";
import { Model } from "sequelize";
import { RolePermissionAttributes } from "@/src/ts/interfaces/app_interfaces";

export default (sequelize: any, DataTypes: any) => {
  class RolePermission
    extends Model<RolePermissionAttributes>
    implements RolePermissionAttributes
  {
    id!: string;
    role_id!: string;
    role_permission_description!: string;
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Role }: any) {
      RolePermission.belongsTo(Role, {
        foreignKey: "role_id",
      });
    }
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
    },
    {
      sequelize,
      modelName: "RolePermission",
    }
  );
  return RolePermission;
};
