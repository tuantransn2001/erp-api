import { z } from "zod";
import { AdditionProductInformationSchema } from "./additionProductInformation.schema";

export type IAdditionProductInformation = z.infer<
  typeof AdditionProductInformationSchema
>;
