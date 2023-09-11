import { z } from "zod";
import { ProductVariantPropertySchema } from "./productVariantProperty.schema";

export type IProductVariantProperty = z.infer<
  typeof ProductVariantPropertySchema
>;
