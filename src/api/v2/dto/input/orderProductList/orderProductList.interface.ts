import { z } from "zod";
import { OrderProductListSchema } from "./orderProductList.schema";

export type IOrderProductList = z.infer<typeof OrderProductListSchema>;
