import { BaseSchema, UUIDType } from "../common/common.schema";

export const UserRoleSchema = BaseSchema.extend({
  role_id: UUIDType,
  user_id: UUIDType,
});

export const CreateUserRoleRowSchema = UserRoleSchema;
