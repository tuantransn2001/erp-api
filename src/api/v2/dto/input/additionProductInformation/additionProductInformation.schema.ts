import { BaseSchema, UUIDType } from "../common/common.schema";

export const AdditionProductInformationSchema = BaseSchema.extend({
  product_id: UUIDType,
  type_id: UUIDType,
  brand_id: UUIDType,
});

export const CreateAdditionProductInformationRowSchema =
  AdditionProductInformationSchema;
