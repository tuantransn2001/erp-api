import {
  CreateAddressItemRowRowSchema,
  CreateCustSuppRowSchema,
  CreateUserRowSchema,
  UUIDArrayType,
} from "../common/common.schema";

export const CreateCustSuppSchema = CreateUserRowSchema.merge(
  CreateCustSuppRowSchema
).extend({
  tags: UUIDArrayType,
  address_list: CreateAddressItemRowRowSchema.array(),
});

export const UpdateCustSuppSchema = CreateCustSuppSchema.partial();
