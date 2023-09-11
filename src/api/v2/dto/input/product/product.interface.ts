import { z } from "zod";
import { ProductSchema } from "./product.schema";

export type IProduct = z.infer<typeof ProductSchema>;
