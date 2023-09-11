import { z } from "zod";
import {
  CreateRoleRowSchema,
  RoleSchema,
  UpdateRoleRowSchema,
} from "./role.schema";

export type IRole = z.infer<typeof RoleSchema>;
export type CreateRoleRowDTO = z.infer<typeof CreateRoleRowSchema>;
export type UpdateRoleRowDTO = z.infer<typeof UpdateRoleRowSchema>;
