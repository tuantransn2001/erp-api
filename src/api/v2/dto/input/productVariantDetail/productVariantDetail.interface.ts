import { z } from "zod";
import { ProductVariantSchema } from "./productVariantDetail.schema";

export type IProductVariant = z.infer<typeof ProductVariantSchema>;
