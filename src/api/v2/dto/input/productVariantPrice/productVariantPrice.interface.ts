import { z } from "zod";
import { ProductVariantPriceSchema } from "./productVariantPrice.schema";

export type IProductVariantPrice = z.infer<typeof ProductVariantPriceSchema>;
