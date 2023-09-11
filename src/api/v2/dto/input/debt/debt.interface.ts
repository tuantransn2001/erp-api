import { z } from "zod";
import { CreateDebtRowSchema, DebtSchema } from "./debt.schema";

export type IDebt = z.infer<typeof DebtSchema>;
export type CreateDebtRowDTO = z.infer<typeof CreateDebtRowSchema>;
