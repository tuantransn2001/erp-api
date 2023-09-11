import { BaseSchema, StringType } from "../common/common.schema";

export const BrandSchema = BaseSchema.extend({
  brand_title: StringType,
  brand_description: StringType,
});
