import { z } from "zod";
import { OrderTagSchema } from "./orderTag.schema";

export type IOrderTag = z.infer<typeof OrderTagSchema>;
