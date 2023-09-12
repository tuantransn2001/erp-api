import { z } from "zod";
import {
  CreateProductRowSchema,
  CreateProductSchema,
  ProductSchema,
} from "./product.schema";

export type IProduct = z.infer<typeof ProductSchema>;
export type CreateProductRowDTO = z.infer<typeof CreateProductRowSchema>;
export type CreateProductDTO = z.infer<typeof CreateProductSchema>;
