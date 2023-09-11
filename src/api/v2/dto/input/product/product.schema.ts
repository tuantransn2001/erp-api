import { BaseSchema, StringType } from "../common/common.schema";

export const ProductSchema = BaseSchema.extend({
  order_product_item_id: StringType,
  agency_branch_product_item_id: StringType,
  product_name: StringType,
  product_classify: StringType,
  product_SKU: StringType,
});
