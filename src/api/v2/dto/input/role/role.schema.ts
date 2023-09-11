import { z } from "zod";
import { BaseSchema, StringType, UUIDType } from "../common/common.schema";

export const RoleSchema = BaseSchema.extend({
  role_title: StringType,
  role_description: StringType,
});

export const CreateRoleRowSchema = z.object({
  role_title: StringType,
  role_description: StringType,
});
export const UpdateRoleRowSchema = CreateRoleRowSchema.extend({
  id: UUIDType,
});
