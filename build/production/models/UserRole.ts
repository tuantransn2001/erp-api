("use strict");
import { Model } from "sequelize";
import { IUserRole } from "../dto/input/userRole/userRole.interface";
export default (sequelize: any, DataTypes: any) => {
  class UserRole extends Model<IUserRole> implements IUserRole {
    id!: string;
    role_id!: string;
    user_id!: string;
    isDelete!: boolean;
    static associate({ User, UserAgencyBranchInCharge, Role }: any) {
      UserRole.belongsTo(User, {
        foreignKey: "user_id",
      });
      UserRole.belongsTo(Role, {
        foreignKey: "role_id",
      });
      UserRole.hasMany(UserAgencyBranchInCharge, {
        foreignKey: "user_role_id",
        as: "User_Agency_Branch_InCharge",
      });
    }
  }
  UserRole.init(
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
      user_id: {
        type: DataTypes.UUID,
      },
      isDelete: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "UserRole",
      timestamps: true,
    }
  );
  return UserRole;
};
