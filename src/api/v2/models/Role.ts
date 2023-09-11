("use strict");
import { Model } from "sequelize";
import { IRole } from "../dto/input/role/role.interface";

export default (sequelize: any, DataTypes: any) => {
  class Role extends Model<IRole> implements IRole {
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
        allowNull: true,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Role",
      timestamps: true,
    }
  );
  return Role;
};
