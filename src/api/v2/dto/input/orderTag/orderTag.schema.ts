import { BaseSchema, UUIDType } from "../common/common.schema";

export const OrderTagSchema = BaseSchema.extend({
  order_id: UUIDType,
  tag_id: UUIDType,
});
