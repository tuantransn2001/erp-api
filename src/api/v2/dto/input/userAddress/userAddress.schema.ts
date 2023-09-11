import { BaseSchema, StringType, UUIDType } from "../common/common.schema";

export const UserAddressSchema = BaseSchema.extend({
  user_id: UUIDType.optional(),
  user_province: StringType,
  user_district: StringType,
  user_specific_address: StringType,
});

export const CreateAddressItemRowRowSchema = UserAddressSchema;
export const BulkCreateAddressItemRowSchema =
  CreateAddressItemRowRowSchema.array();

export const UpdateAddressItemRowSchema =
  CreateAddressItemRowRowSchema.partial();
