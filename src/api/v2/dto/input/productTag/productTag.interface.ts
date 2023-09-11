import { z } from "zod";
import { ProductTagSchema } from "./productTag.schema";

export type IProductTag = z.infer<typeof ProductTagSchema>;
