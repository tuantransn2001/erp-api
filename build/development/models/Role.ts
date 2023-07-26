("use strict");
import { Model } from "sequelize";
<<<<<<<< HEAD:build/production/v1/models/Role.ts
import { RoleAttributes } from "@/src/api/v1/ts/interfaces/app_interfaces";
========
import { RoleAttributes } from "@/src/api/v2/ts/interfaces/app_interfaces";
>>>>>>>> dev/api-v2:src/api/v2/models/Role.ts

export default (sequelize: any, DataTypes: any) => {
  class Role extends Model<RoleAttributes> implements RoleAttributes {
    id!: string;
    role_title!: string;
    role_description!: string;
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ StaffRole }: any) {
      Role.hasMany(StaffRole, {
        foreignKey: "role_id",
      });
    }
  }
  Role.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      role_title: {
        type: DataTypes.STRING,
      },
      role_description: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "Role",
    }
  );
  return Role;
};
