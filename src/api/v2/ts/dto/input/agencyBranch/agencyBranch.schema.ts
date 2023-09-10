import { z } from "zod";
import { BooleanType, StringType } from "../common/common.schema";

export const CreateAgencyBranchSchema = z.object({
  agency_branch_code: StringType.nonempty({
    message: "Branch code is required!!",
  }),
  agency_branch_name: StringType.nonempty({
    message: "Branch name is required!!",
  }),
  agency_branch_phone: StringType.nonempty({
    message: "Branch phone is required!!",
  }),
  agency_branch_address: StringType.nonempty({
    message: "Branch address is required!!",
  }),
  agency_branch_area: StringType.nonempty({
    message: "Branch area is required!!",
  }),
  agency_branch_expiration_date: StringType,
  agency_branch_status: StringType.nonempty({
    message: "Branch status is required!!",
  }),
  isDefaultCN: BooleanType,
});
