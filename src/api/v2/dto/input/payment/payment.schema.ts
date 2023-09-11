import { BaseSchema, StringType } from "../common/common.schema";

export const PaymentSchema = BaseSchema.extend({
  payment_type: StringType,
  payment_description: StringType,
});
