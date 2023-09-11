import { z } from "zod";
import {
  CreateStaffRowSchema,
  CreateStaffSchema,
  StaffSchema,
} from "./staff.schema";

export type IStaff = z.infer<typeof StaffSchema>;
export type CreateStaffDTO = z.infer<typeof CreateStaffSchema>;
export type CreateStaffRowDTO = z.infer<typeof CreateStaffRowSchema>;
