"use strict";
import { Model } from "sequelize";
import { UserAgencyBranchInChargeAttributes } from "@/src/api/v2/ts/interfaces/entities_interfaces";
export default (sequelize: any, DataTypes: any) => {
  class UserAgencyBranchInCharge
    extends Model<UserAgencyBranchInChargeAttributes>
    implements UserAgencyBranchInChargeAttributes
  {
    id!: string;
    user_role_id!: string;
    agency_branch_id!: string;
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
    },
    {
      sequelize,
      modelName: "UserAgencyBranchInCharge",
    }
  );
  return UserAgencyBranchInCharge;
};
