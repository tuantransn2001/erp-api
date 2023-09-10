import { z } from "zod";
import { CreateAgencyBranchSchema } from "./agencyBranch.schema";

export type CreateAgencyBranchDTO = z.infer<typeof CreateAgencyBranchSchema>;
