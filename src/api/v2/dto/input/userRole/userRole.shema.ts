import { z } from "zod";
import {
  BaseSchema,
  StringArrayType,
  StringType,
  UUIDType,
} from "../common/common.schema";

export const UserRoleSchema = BaseSchema.extend({
  role_id: UUIDType,
  user_id: UUIDType,
});

export const CreateUserRoleRowSchema = UserRoleSchema;
export const CreateUserRoleSchema = z.object({
  roles: z
    .object({
      role_id: StringType,
      agencyBranches_inCharge_ids: StringArrayType,
    })
    .array(),
});
