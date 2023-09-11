import { BaseSchema, StringType } from "../common/common.schema";

export const TypeSchema = BaseSchema.extend({
  type_title: StringType,
  type_description: StringType,
});
