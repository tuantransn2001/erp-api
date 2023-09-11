import { z } from "zod";
import { BrandSchema } from "./brand.schema";

export type IBrand = z.infer<typeof BrandSchema>;
