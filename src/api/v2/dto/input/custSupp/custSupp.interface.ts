import { z } from "zod";
import {
  CreateCustSuppRowSchema,
  CreateCustSuppSchema,
  CustSuppSchema,
  MultipleSoftDeleteCustSuppSchema,
  UpdateCustSuppRowSchema,
  UpdateCustSuppSchema,
} from "./custSupp.schema";

export type ICustSupp = z.infer<typeof CustSuppSchema>;
export type CreateCustSuppDTO = z.infer<typeof CreateCustSuppSchema>;
export type UpdateCustSuppDTO = z.infer<typeof UpdateCustSuppSchema>;
export type CreateCustSuppRowDTO = z.infer<typeof CreateCustSuppRowSchema>;
export type UpdateCustSuppRowDTO = z.infer<typeof UpdateCustSuppRowSchema>;
export type MultipleSoftDeleteCustSuppDTO = z.infer<
  typeof MultipleSoftDeleteCustSuppSchema
>;
