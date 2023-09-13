"use strict";
import { Model } from "sequelize";
import { IUserAgencyBranchInCharge } from "../dto/input/userAgencyBranchInCharge/userAgencyBranchInCharge.interface";
export default (sequelize: any, DataTypes: any) => {
  class UserAgencyBranchInCharge
    extends Model<IUserAgencyBranchInCharge>
    implements IUserAgencyBranchInCharge
  {
    id!: string;
    user_role_id!: string;
    agency_branch_id!: string;
    isDelete!: boolean;
    static associate({ UserRole, AgencyBranch }: any) {
      UserAgencyBranchInCharge.belongsTo(UserRole, {
        foreignKey: "user_role_id",
        as: "User_Agency_Branch_InCharge",
      });
      UserAgencyBranchInCharge.belongsTo(AgencyBranch, {
        foreignKey: "agency_branch_id",
      });
    }
  }
  UserAgencyBranchInCharge.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      user_role_id: { type: DataTypes.UUID },
      agency_branch_id: { type: DataTypes.UUID },
      isDelete: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "UserAgencyBranchInCharge",
      timestamps: true,
    }
  );
  return UserAgencyBranchInCharge;
};
