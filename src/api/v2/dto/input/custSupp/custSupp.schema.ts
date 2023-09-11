import {
  BaseSchema,
  StringType,
  UUIDArrayType,
  UUIDType,
} from "../common/common.schema";
import { CreateUserRowSchema } from "../user/user.schema";
import { CreateAddressItemRowRowSchema } from "../userAddress/userAddress.schema";

export const CustSuppSchema = BaseSchema.extend({
  user_id: StringType.nonempty(),
  staff_id: StringType.nonempty(),
  staff_in_charge_note: StringType,
  status: StringType,
});

export const CreateCustSuppRowSchema = CustSuppSchema.partial();

export const CreateCustSuppSchema = CreateUserRowSchema.merge(
  CustSuppSchema
).extend({
  tags: UUIDArrayType,
  address_list: CreateAddressItemRowRowSchema.array(),
});
export const UpdateCustSuppSchema = CreateCustSuppSchema.partial();

export const UpdateCustSuppRowSchema = CreateCustSuppSchema.partial().extend({
  id: UUIDType.optional(),
});
