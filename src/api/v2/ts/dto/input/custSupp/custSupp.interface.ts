import { z } from "zod";
import { CreateCustSuppSchema, UpdateCustSuppSchema } from "./custSupp.schema";

export type CreateCustSuppDTO = z.infer<typeof CreateCustSuppSchema>;
export type UpdateCustSuppDTO = z.infer<typeof UpdateCustSuppSchema>;
