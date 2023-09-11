import { z } from "zod";
import { AgencyBranchProductListSchema } from "./agencyBranchProductList.schema";

export type IAgencyBranchProductList = z.infer<
  typeof AgencyBranchProductListSchema
>;
