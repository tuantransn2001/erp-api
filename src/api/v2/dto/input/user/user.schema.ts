import {
  BaseSchema,
  DateType,
  StringType,
  UUIDType,
} from "../common/common.schema";

export const UserSchema = BaseSchema.extend({
  user_phone: StringType,
  user_email: StringType,
  user_name: StringType,
  user_code: StringType.optional(),
  updatedAt: DateType.optional(),
  createdAt: DateType.optional(),
  user_type: StringType.optional(),
  user_password: StringType.nullable().optional(),
});

export const CreateUserRowSchema = UserSchema;
export const UpdateUserRowSchema = CreateUserRowSchema.partial().extend({
  id: UUIDType.optional(),
});
