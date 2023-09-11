import { z } from "zod";
import { BaseSchema } from "./common.schema";

export type IBaseInterface = z.infer<typeof BaseSchema>;
