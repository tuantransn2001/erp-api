import {
  AgencyBranchAttributes,
  RoleAttributes,
  StaffAgencyBranchInChargeAttributes,
  StaffAttributes,
  StaffRoleAttributes,
  UserAddressAttributes,
  UserAttributes,
} from "@/src/ts/interfaces/app_interfaces";

type UserAttributesExclude = Omit<
  UserAttributes,
  "user_code" | "user_password" | "user_type" | "isDelete"
>;

type StaffQueryAttributesExclude = Omit<StaffAttributes, "user_id">;

type StaffRoleQueryAttributesExclude = Omit<
  StaffRoleAttributes,
  "role_id" | "staff_id"
>;

type RoleAttributesExclude = Omit<RoleAttributes, "role_description">;
type AgencyAttributesExclude = Omit<
  AgencyBranchAttributes,
  | "agency_branch_phone"
  | "agency_branch_code"
  | "agency_branch_address"
  | "agency_branch_area"
  | "agency_branch_expiration_date"
  | "agency_branch_status"
  | "isDefaultCN"
>;

type StaffAgencyInChargeAttributesExclude = Omit<
  StaffAgencyBranchInChargeAttributes,
  "staff_role_id" | "agency_branch_id"
>;

interface StaffAgencyBranchInChargeQueryAttributes
  extends StaffAgencyInChargeAttributesExclude {
  AgencyBranch: { dataValues: AgencyAttributesExclude };
}

interface StaffRoleIncludeRoleAndAgencyQueryAttributes
  extends StaffRoleQueryAttributesExclude {
  Role: { dataValues: RoleAttributesExclude };
  Staff_Agency_Branch_InCharge: Array<{
    dataValues: StaffAgencyBranchInChargeQueryAttributes;
  }>;
}

interface StaffQueryAttributes extends StaffQueryAttributesExclude {
  StaffRoles: Array<{
    dataValues: StaffRoleIncludeRoleAndAgencyQueryAttributes;
  }>;
}

interface UserQueryAttributes extends UserAttributesExclude {
  Staff: {
    dataValues: StaffQueryAttributes;
  };
  UserAddresses: Array<{ dataValues: UserAddressAttributes }>;
}

interface UserStaffQueryAttributes {
  dataValues: UserQueryAttributes;
}

interface StaffDetailResultAttributes {
  id: string;
  staff_id: string;
  staff_phone: string;
  staff_name: string;
  staff_email: string;
  staff_status: string;
  note_about_staff: string;
  staff_birthday: Date;
  staff_gender: string;
  isAllowViewImportNWholesalePrice: boolean;
  isAllowViewShippingPrice: boolean;
  createdAt: Date;
  staff_role: Array<{
    staff_role_id: string;
    role_id: string;
    role_title: string;
    agency_inCharges: Array<{
      staff_agency_branch_inCharge_id: string;
      agency_branch_id: string;
      agency_branch_name: string;
    }>;
  }>;
  staff_address: Array<{ dataValues: UserAddressAttributes }>;
}

interface StaffItemResultAttributes {
  id: string;
  staff_phone: string;
  staff_name: string;
  staff_id: string;
  staff_status: string;
  createdAt: Date;
}

interface UserStaffItemAttributesExclude
  extends Omit<
    UserAttributes,
    "user_code" | "user_email" | "user_password" | "user_type" | "isDelete"
  > {
  Staff: {
    dataValues: Omit<
      StaffAttributes,
      | "user_id"
      | "staff_birthday"
      | "note_about_staff"
      | "staff_gender"
      | "isAllowViewImportNWholesalePrice"
      | "isAllowViewShippingPrice"
    >;
  };
}

interface StaffItemQueryInCludeStaffQueryAttributes {
  dataValues: UserStaffItemAttributesExclude;
}

export const handleFormatStaff = (
  userStaffs: Array<StaffItemQueryInCludeStaffQueryAttributes> &
    UserStaffQueryAttributes,
  formatType: string
): Array<StaffItemResultAttributes> | StaffDetailResultAttributes => {
  if (formatType === "isObject") {
    const {
      id,
      user_phone: staff_phone,
      user_name: staff_name,
      user_email: staff_email,
      UserAddresses: staff_address,
    } = userStaffs.dataValues;
    const {
      id: staff_id,
      staff_status,
      staff_birthday,
      note_about_staff,
      staff_gender,
      isAllowViewImportNWholesalePrice,
      isAllowViewShippingPrice,
    } = userStaffs.dataValues.Staff.dataValues;
    const staff_role = userStaffs.dataValues.Staff.dataValues.StaffRoles.reduce(
      (
        res: any,
        staff_role: {
          dataValues: StaffRoleIncludeRoleAndAgencyQueryAttributes;
        }
      ) => {
        const { id: staff_role_id } = staff_role.dataValues;
        const { id: role_id, role_title } =
          staff_role.dataValues.Role.dataValues;
        const agency_inCharges =
          staff_role.dataValues.Staff_Agency_Branch_InCharge.map(
            (agency_inCharge: {
              dataValues: StaffAgencyBranchInChargeQueryAttributes;
            }) => {
              const { id: staff_agency_branch_inCharge_id } =
                agency_inCharge.dataValues;
              const { id: agency_branch_id, agency_branch_name } =
                agency_inCharge.dataValues.AgencyBranch.dataValues;
              return {
                staff_agency_branch_inCharge_id,
                agency_branch_id,
                agency_branch_name,
              };
            }
          );

        const newStaffRoleResult = {
          staff_role_id,
          role_id,
          role_title,
          agency_inCharges,
        };
        res.push(newStaffRoleResult);
        return res;
      },
      []
    );

    return {
      id,
      staff_id,
      staff_phone,
      staff_name,
      staff_email,
      staff_status,
      staff_birthday,
      note_about_staff,
      staff_gender: staff_gender ? "male" : "female",
      isAllowViewImportNWholesalePrice,
      isAllowViewShippingPrice,
      createdAt: userStaffs.dataValues.createdAt as Date,
      staff_role,
      staff_address,
    };
  }

  return userStaffs.map(
    (u_staff: StaffItemQueryInCludeStaffQueryAttributes) => {
      const {
        id,
        user_phone: staff_phone,
        user_name: staff_name,
      } = u_staff.dataValues;

      const { id: staff_id, staff_status } =
        u_staff.dataValues.Staff.dataValues;
      return {
        id,
        staff_id,
        staff_name,
        staff_status,
        staff_phone,
        createdAt: u_staff.dataValues.createdAt as Date,
      };
    }
  );
};
