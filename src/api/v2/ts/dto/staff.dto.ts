import { UserAttributes } from "../interfaces/app_interfaces";
import { ObjectType } from "../types/app_type";

export interface StaffRoleInputDTO {
  role_id: string;
  agencyBranches_inCharge: string[];
}

export interface CreateStaffDTO extends Partial<UserAttributes> {
  staff_gender: boolean;
  isAllowViewImportNWholesalePrice: boolean;
  isAllowViewShippingPrice: boolean;
  staff_birthday: Date;
  roles: StaffRoleInputDTO[];
  address_list: ObjectType<string>[];
}

export interface UpdateRoleDTO {
  staff_id: string;
  roles: StaffRoleInputDTO[] | undefined;
}

export interface UpdateDetailDTO extends Partial<CreateStaffDTO> {
  staff_id: string;
  staff_address_list: ObjectType<string>[];
}
