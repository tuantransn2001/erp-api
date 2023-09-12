import { z } from "zod";
import {
  BulkCreateProductTagRowSchema,
  CreateProductTagRowSchema,
  ProductTagSchema,
} from "./productTag.schema";

export type IProductTag = z.infer<typeof ProductTagSchema>;
export type CreateProductTagRowDTO = z.infer<typeof CreateProductTagRowSchema>;
export type BulkCreateProductTagRowDTO = z.infer<
  typeof BulkCreateProductTagRowSchema
>;
