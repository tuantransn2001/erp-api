import { z } from "zod";
import {
  CreateUserRowSchema,
  UpdateUserRowSchema,
  UserSchema,
} from "./user.schema";
export type IUser = z.infer<typeof UserSchema>;
export type CreateUserRowDTO = z.infer<typeof CreateUserRowSchema>;
export type UpdateUserRowDTO = z.infer<typeof UpdateUserRowSchema>;
