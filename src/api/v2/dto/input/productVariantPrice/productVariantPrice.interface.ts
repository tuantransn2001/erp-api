import { z } from "zod";
import {
  BulkCreateProductVariantPriceRowSchema,
  CreateProductVariantPriceRowSchema,
  ProductVariantPriceSchema,
} from "./productVariantPrice.schema";

export type IProductVariantPrice = z.infer<typeof ProductVariantPriceSchema>;
export type CreateProductVariantPriceRowDTO = z.infer<
  typeof CreateProductVariantPriceRowSchema
>;
export type BulkCreateProductVariantPriceRowDTO = z.infer<
  typeof BulkCreateProductVariantPriceRowSchema
>;
