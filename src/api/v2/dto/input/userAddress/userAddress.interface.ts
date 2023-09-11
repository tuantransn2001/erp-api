import { z } from "zod";
import {
  BulkCreateAddressItemRowSchema,
  CreateAddressItemRowRowSchema,
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
