import { BaseSchema, StringType } from "../common/common.schema";

export const CustSuppTagSchema = BaseSchema.extend({
  custSupp_id: StringType,
  tag_id: StringType,
});
