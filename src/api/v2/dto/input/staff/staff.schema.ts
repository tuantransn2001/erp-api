import { BaseSchema, BooleanType, StringType } from "../common/common.schema";
import { CreateUserRowSchema } from "../user/user.schema";

import { CreateUserRoleSchema } from "../userRole/userRole.shema";

export const StaffSchema = BaseSchema.extend({
  user_id: StringType.optional(),
  staff_status: StringType.optional(),
  staff_birthday: StringType,
  note_about_staff: StringType,
  staff_gender: BooleanType,
  isAllowViewImportNWholesalePrice: BooleanType,
  isAllowViewShippingPrice: BooleanType,
});

export const CreateStaffRowSchema = StaffSchema;
export const UpdateStaffRowSchema = CreateStaffRowSchema;
export const CreateStaffSchema =
  CreateUserRowSchema.merge(CreateStaffRowSchema).merge(CreateUserRoleSchema);

export const UpdateStaffSchema = CreateStaffSchema.partial();
