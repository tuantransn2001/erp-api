import { z } from "zod";
import {
  CreateStaffRowSchema,
  CreateStaffSchema,
  StaffSchema,
  UpdateStaffRowSchema,
  UpdateStaffSchema,
} from "./staff.schema";

export type IStaff = z.infer<typeof StaffSchema>;
export type CreateStaffRowDTO = z.infer<typeof CreateStaffRowSchema>;
export type UpdateStaffRowDTO = z.infer<typeof UpdateStaffRowSchema>;
export type CreateStaffDTO = z.infer<typeof CreateStaffSchema>;
export type UpdateStaffDTO = z.infer<typeof UpdateStaffSchema>;
