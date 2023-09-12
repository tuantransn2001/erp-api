import { z } from "zod";
import {
  BaseSchema,
  StringArrayType,
  StringType,
  UUIDType,
} from "../common/common.schema";

export const ProductSchema = BaseSchema.extend({
  order_product_item_id: UUIDType.optional(),
  agency_branch_product_item_id: UUIDType.optional(),
  product_name: StringType,
  product_classify: StringType,
  product_SKU: StringType.optional(),
});

export const CreateProductRowSchema = ProductSchema;

export const CreateProductSchema = ProductSchema.merge(
  z.object({
    type_id: UUIDType,
    brand_id: UUIDType,
    tagIds: StringArrayType,
    product_weight: StringType,
    product_weight_calculator_unit: StringType,
    properties: z
      .object({
        key: StringType,
        values: StringArrayType,
      })
      .array(),
    product_variant_prices: z
      .object({
        price_id: UUIDType,
        price_value: StringType,
      })
      .array(),
  })
);
