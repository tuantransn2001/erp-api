import { BaseSchema, StringType } from "../common/common.schema";

export const ShipperSchema = BaseSchema.extend({
  shipper_unit: StringType,
  shipper_phone: StringType,
});
