import { BaseSchema, StringType } from "../common/common.schema";

export const ProductTagSchema = BaseSchema.extend({
  tag_id: StringType,
  addition_product_information_id: StringType,
});
export const CreateProductTagRowSchema = ProductTagSchema;
export const BulkCreateProductTagRowSchema = ProductTagSchema.array();
