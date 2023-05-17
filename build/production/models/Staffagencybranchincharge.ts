"use strict";
import { Model } from "sequelize";
import { StaffAgencyBranchInChargeAttributes } from "@/src/ts/interfaces/app_interfaces";
export default (sequelize: any, DataTypes: any) => {
  class StaffAgencyBranchInCharge
    extends Model<StaffAgencyBranchInChargeAttributes>
    implements StaffAgencyBranchInChargeAttributes
  {
    id!: string;
    staff_role_id!: string;
    agency_branch_id!: string;
    static associate(models: any) {
      StaffAgencyBranchInCharge.belongsTo(models.StaffRole, {
        foreignKey: "staff_role_id",
      });
      StaffAgencyBranchInCharge.belongsTo(models.AgencyBranch, {
        foreignKey: "agency_branch_id",
      });
    }
  }
  StaffAgencyBranchInCharge.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      staff_role_id: { type: DataTypes.UUID },
      agency_branch_id: { type: DataTypes.UUID },
    },
    {
      sequelize,
      modelName: "StaffAgencyBranchInCharge",
    }
  );
  return StaffAgencyBranchInCharge;
};
