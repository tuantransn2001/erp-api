import { z } from "zod";
import {
  BulkCreateAddressItemRowSchema,
  BulkUpdateAddressItemRowSchema,
  CreateAddressItemRowRowSchema,
  UpdateAddressItemRowRowSchema,
  UpdateAddressItemRowSchema,
  UserAddressSchema,
} from "./userAddress.schema";

export type IUserAddress = z.infer<typeof UserAddressSchema>;

export type CreateUserAddressItemRowDTO = z.infer<
  typeof CreateAddressItemRowRowSchema
>;
export type UpdateUserAddressItemRowDTO = z.infer<
  typeof UpdateAddressItemRowSchema
>;
export type BulkCreateUserAddressItemRowDTO = z.infer<
  typeof BulkCreateAddressItemRowSchema
>;
export type UpdateAddressItemRowRowDTO = z.infer<
  typeof UpdateAddressItemRowRowSchema
>;
export type BulkUpdateAddressItemRowDTO = z.infer<
  typeof BulkUpdateAddressItemRowSchema
>;
