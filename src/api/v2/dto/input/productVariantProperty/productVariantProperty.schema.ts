import { BaseSchema, StringType } from "../common/common.schema";

export const ProductVariantPropertySchema = BaseSchema.extend({
  product_variant_id: StringType,
  product_variant_property_key: StringType,
  product_variant_property_value: StringType,
});

export const CreateProductVariantPropertyRowSchema =
  ProductVariantPropertySchema;
export const BulkCreateProductVariantPropertyRowSchema =
  CreateProductVariantPropertyRowSchema.array();
