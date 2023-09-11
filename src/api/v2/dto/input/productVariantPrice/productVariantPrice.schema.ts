import { BaseSchema, StringType, UUIDType } from "../common/common.schema";

export const ProductVariantPriceSchema = BaseSchema.extend({
  product_variant_id: UUIDType,
  price_id: UUIDType,
  price_value: StringType,
});
