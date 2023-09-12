import { z } from "zod";
import {
  AdditionProductInformationSchema,
  CreateAdditionProductInformationRowSchema,
} from "./additionProductInformation.schema";

export type IAdditionProductInformation = z.infer<
  typeof AdditionProductInformationSchema
>;
export type CreateAdditionProductInformationRowDTO = z.infer<
  typeof CreateAdditionProductInformationRowSchema
>;
