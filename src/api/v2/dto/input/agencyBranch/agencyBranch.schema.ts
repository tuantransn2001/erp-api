import { BooleanType, StringType } from "../common/common.schema";
import { BaseSchema } from "../common/common.schema";
export const AgencyBranchSchema = BaseSchema.extend({
  agency_branch_code: StringType,
  agency_branch_name: StringType,
  agency_branch_phone: StringType,
  agency_branch_address: StringType,
  agency_branch_area: StringType,
  agency_branch_expiration_date: StringType,
  agency_branch_status: StringType,
  isDefaultCN: BooleanType,
});

export const CreateAgencyBranchSchema = AgencyBranchSchema;
