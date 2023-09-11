import { BaseSchema, NumberType, StringType } from "../common/common.schema";

export const OrderSchema = BaseSchema.extend({
  agency_branch_id: StringType,
  shipper_id: StringType,
  payment_id: StringType,
  staff_id: StringType,
  custSupp_id: StringType,
  order_type: StringType,
  order_code: StringType,
  order_delivery_date: StringType,
  order_status: StringType,
  order_total: NumberType,
  order_note: StringType,
});
