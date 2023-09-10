("use strict");
import { Model } from "sequelize";
import { RoleAttributes } from "@/src/api/v2/ts/interfaces/entities_interfaces";

export default (sequelize: any, DataTypes: any) => {
  class Role extends Model<RoleAttributes> implements RoleAttributes {
    id!: string;
    role_title!: string;
    role_description!: string;
    isDelete!: boolean;
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ UserRole }: any) {
      Role.hasMany(UserRole, {
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
      isDelete: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Role",
    }
  );
  return Role;
};
