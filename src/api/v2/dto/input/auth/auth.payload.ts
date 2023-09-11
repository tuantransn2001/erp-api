import { z } from "zod";
import { GetMeSchema } from "./auth.schema";

export type GetMePayload = z.infer<typeof GetMeSchema>;
