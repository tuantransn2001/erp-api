import { z } from "zod";
import {
  BulkCreatePriceItemRowSchema,
  CreatePriceItemRowSchema,
  PriceSchema,
  UpdatePriceItemRowSchema,
} from "./price.schema";
export type IPrice = z.infer<typeof PriceSchema>;
export type CreatePriceItemRowDTO = z.infer<typeof CreatePriceItemRowSchema>;
export type UpdatePriceItemRowDTO = z.infer<typeof UpdatePriceItemRowSchema>;
export type BulkCreatePriceItemRowDTO = z.infer<
  typeof BulkCreatePriceItemRowSchema
>;
