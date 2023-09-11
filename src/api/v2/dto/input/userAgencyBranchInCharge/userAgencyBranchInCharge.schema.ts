import { BaseSchema, StringType } from "../common/common.schema";

export const UserAgencyBranchInChargeSchema = BaseSchema.extend({
  user_role_id: StringType,
  agency_branch_id: StringType,
});

export const CreateUserAgencyBranchInChargeSchema =
  UserAgencyBranchInChargeSchema;
