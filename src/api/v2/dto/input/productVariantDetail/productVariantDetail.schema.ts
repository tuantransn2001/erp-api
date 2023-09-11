import { BaseSchema, NumberType, StringType } from "../common/common.schema";

export const ProductVariantSchema = BaseSchema.extend({
  product_id: StringType,
  product_variant_name: StringType,
  product_variant_SKU: StringType,
  product_variant_barcode: StringType,
  product_weight: NumberType,
  product_weight_calculator_unit: StringType,
});
