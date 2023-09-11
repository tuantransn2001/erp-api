import { z } from "zod";
import { CreateUserRoleRowSchema, UserRoleSchema } from "./userRole.shema";

export type IUserRole = z.infer<typeof UserRoleSchema>;
export type CreateUserRoleRowDTO = z.infer<typeof CreateUserRoleRowSchema>;
