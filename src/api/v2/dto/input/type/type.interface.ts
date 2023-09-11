import { z } from "zod";
import { TypeSchema } from "./type.schema";

export type IType = z.infer<typeof TypeSchema>;
