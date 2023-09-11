import { z } from "zod";
import {
  CreateUserRoleRowSchema,
  CreateUserRoleSchema,
  UserRoleSchema,
} from "./userRole.shema";

export type IUserRole = z.infer<typeof UserRoleSchema>;
export type CreateUserRoleRowDTO = z.infer<typeof CreateUserRoleRowSchema>;
export type CreateUserRoleDTO = z.infer<typeof CreateUserRoleSchema>;
