("use strict");
import { Model } from "sequelize";
<<<<<<<< HEAD:build/production/v1/models/StaffRole.ts
import { StaffRoleAttributes } from "@/src/api/v1/ts/interfaces/app_interfaces";
========
import { StaffRoleAttributes } from "@/src/api/v2/ts/interfaces/app_interfaces";
>>>>>>>> dev/api-v2:src/api/v2/models/StaffRole.ts

export default (sequelize: any, DataTypes: any) => {
  class StaffRole
    extends Model<StaffRoleAttributes>
    implements StaffRoleAttributes
  {
    id!: string;
    role_id!: string;
    staff_id!: string;

    static associate({ Staff, StaffAgencyBranchInCharge, Role }: any) {
      StaffRole.belongsTo(Staff, {
        foreignKey: "staff_id",
      });
      StaffRole.belongsTo(Role, {
        foreignKey: "role_id",
      });
      StaffRole.hasMany(StaffAgencyBranchInCharge, {
        foreignKey: "staff_role_id",
        as: "Staff_Agency_Branch_InCharge",
      });
    }
  }
  StaffRole.init(
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
      staff_id: {
        type: DataTypes.UUID,
      },
    },
    {
      sequelize,
      modelName: "StaffRole",
    }
  );
  return StaffRole;
};
