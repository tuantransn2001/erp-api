import { BaseSchema, NumberType, StringType } from "../common/common.schema";

export const OrderProductListSchema = BaseSchema.extend({
  order_id: StringType,
  product_variant_id: StringType,
  product_price: NumberType,
  product_amount: NumberType,
  product_discount: NumberType,
  product_unit: StringType,
});
