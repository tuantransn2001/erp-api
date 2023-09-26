import { ERROR_MESSAGE } from "../../../ts/enums/app_enums";
import {
  BaseSchema,
  DateType,
  StringType,
  UUIDType,
} from "../common/common.schema";

export const UserSchema = BaseSchema.extend({
  user_phone: StringType.min(9, ERROR_MESSAGE.inValid),
  user_email: StringType.min(11, ERROR_MESSAGE.inValid),
  user_name: StringType.min(5, ERROR_MESSAGE.inValid),
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
