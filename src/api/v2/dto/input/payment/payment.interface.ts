import { z } from "zod";
import { PaymentSchema } from "./payment.schema";

export type IPayment = z.infer<typeof PaymentSchema>;
