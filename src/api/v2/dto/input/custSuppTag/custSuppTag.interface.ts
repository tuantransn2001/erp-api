import { z } from "zod";
import { CustSuppTagSchema } from "./custSuppTag.schema";

export type ICustSuppTag = z.infer<typeof CustSuppTagSchema>;
