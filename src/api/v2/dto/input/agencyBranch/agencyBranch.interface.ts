import { z } from "zod";
import {
  AgencyBranchSchema,
  CreateAgencyBranchSchema,
} from "./agencyBranch.schema";

export type IAgencyBranch = z.infer<typeof AgencyBranchSchema>;
export type CreateAgencyBranchDTO = z.infer<typeof CreateAgencyBranchSchema>;
