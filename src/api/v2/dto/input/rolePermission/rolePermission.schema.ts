import { BaseSchema, StringType } from "../common/common.schema";

export const RolePermissionSchema = BaseSchema.extend({
  role_id: StringType,
  role_permission_description: StringType,
});
