import { z } from "zod";
import {
  CreateProductVariantRowSchema,
  BulkCreateProductVariantRowSchema,
  ProductVariantSchema,
} from "./productVariantDetail.schema";

export type IProductVariant = z.infer<typeof ProductVariantSchema>;
export type CreateProductVariantRowDTO = z.infer<
  typeof CreateProductVariantRowSchema
>;
export type BulkCreateProductVariantRowDTO = z.infer<
  typeof BulkCreateProductVariantRowSchema
>;
