import { BaseSchema, NumberType, UUIDType } from "../common/common.schema";

export const AgencyBranchProductListSchema = BaseSchema.extend({
  agency_branch_id: UUIDType,
  product_variant_id: UUIDType,
  available_quantity: NumberType,
  trading_quantity: NumberType,
  available_to_sell_quantity: NumberType,
  product_price: NumberType,
  product_discount: NumberType,
});
