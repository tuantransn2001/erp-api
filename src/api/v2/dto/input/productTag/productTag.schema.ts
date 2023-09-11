import { BaseSchema, StringType } from "../common/common.schema";

export const ProductTagSchema = BaseSchema.extend({
  tag_id: StringType,
  addition_product_information_id: StringType,
});
