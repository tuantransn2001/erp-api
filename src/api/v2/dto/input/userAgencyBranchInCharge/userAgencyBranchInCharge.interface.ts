import { z } from "zod";
import {
  CreateUserAgencyBranchInChargeSchema,
  UserAgencyBranchInChargeSchema,
} from "./userAgencyBranchInCharge.schema";

export type IUserAgencyBranchInCharge = z.infer<
  typeof UserAgencyBranchInChargeSchema
>;

export type CreateUserAgencyBranchInChargeRowDTO = z.infer<
  typeof CreateUserAgencyBranchInChargeSchema
>;
