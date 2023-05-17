("use strict");
import { Model } from "sequelize";
import { StaffRoleAttributes } from "@/src/ts/interfaces/app_interfaces";

export default (sequelize: any, DataTypes: any) => {
  class StaffRole
    extends Model<StaffRoleAttributes>
    implements StaffRoleAttributes
  {
    id!: string;
    role_id!: string;
    staff_id!: string;

    static associate({ Staff, Role, StaffAgencyBranchInCharge }: any) {
      StaffRole.hasOne(Role, { foreignKey: "role_id" });
      StaffRole.belongsTo(Staff, {
        foreignKey: "staff_id",
      });
      StaffRole.hasMany(StaffAgencyBranchInCharge, {
        foreignKey: "staff_role_id",
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
