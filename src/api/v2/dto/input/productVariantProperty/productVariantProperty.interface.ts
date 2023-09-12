import { z } from "zod";
import {
  BulkCreateProductVariantPropertyRowSchema,
  CreateProductVariantPropertyRowSchema,
  ProductVariantPropertySchema,
} from "./productVariantProperty.schema";

export type IProductVariantProperty = z.infer<
  typeof ProductVariantPropertySchema
>;
export type CreateProductVariantPropertyRowDTO = z.infer<
  typeof CreateProductVariantPropertyRowSchema
>;
export type BulkCreateProductVariantPropertyRowDTO = z.infer<
  typeof BulkCreateProductVariantPropertyRowSchema
>;
