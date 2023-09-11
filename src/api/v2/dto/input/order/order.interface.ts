import { z } from "zod";
import { OrderSchema } from "./order.schema";

export type IOrder = z.infer<typeof OrderSchema>;
