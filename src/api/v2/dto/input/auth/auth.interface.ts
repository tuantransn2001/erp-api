import { z } from "zod";
import { LoginSchema } from "./auth.schema";

export type LoginDTO = z.infer<typeof LoginSchema>;
