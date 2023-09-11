import { z } from "zod";
import {
  BaseSchema,
  BooleanType,
  StringArrayType,
  StringType,
} from "../common/common.schema";
import { CreateUserRowSchema } from "../user/user.schema";
import { BulkCreateAddressItemRowSchema } from "../userAddress/userAddress.schema";

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
export const CreateStaffSchema = CreateUserRowSchema.merge(
  CreateStaffRowSchema
).extend({
  address_list: BulkCreateAddressItemRowSchema,
  roles: z
    .object({
      role_id: StringType,
      agencyBranches_inCharge: StringArrayType,
    })
    .array(),
});
