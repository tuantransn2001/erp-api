import { z } from "zod";
import {
  BulkCreateTagItemRowSchema,
  BulkCreatePriceItemRowSchema,
  BulkUpdateTagItemRowSchema,
  CreateAddressItemRowRowSchema,
  CreateCustSuppRowSchema,
  CreatePriceItemRowSchema,
  CreateUserRowSchema,
  UpdateAddressItemRowSchema,
  UpdateCustSuppRowSchema,
  UpdateTagItemRowSchema,
  UpdateUserRowSchema,
  UpdatePriceItemRowSchema,
  CreateDebtRowSchema,
  CreateRoleRowSchema,
  UpdateRoleRowSchema,
  CreateStaffSchema,
  CreateStaffRowSchema,
  BulkCreateAddressItemRowSchema,
  CreateUserRoleRowSchema,
  CreateAgencyBranchInChargeRowSchema,
} from "./common.schema";

// * ==========================================================================
// * ===================== CREATE =============================================
// * ==========================================================================
export type CreateAddressItemRowDTO = z.infer<
  typeof CreateAddressItemRowRowSchema
>;
export type CreateUserRowDTO = z.infer<typeof CreateUserRowSchema>;
export type CreateUserRoleRowDTO = z.infer<typeof CreateUserRoleRowSchema>;
export type CreateCustSuppRowDTO = z.infer<typeof CreateCustSuppRowSchema>;
export type CreatePriceItemRowDTO = z.infer<typeof CreatePriceItemRowSchema>;
export type CreateDebtRowDTO = z.infer<typeof CreateDebtRowSchema>;
export type CreateRoleRowDTO = z.infer<typeof CreateRoleRowSchema>;
export type CreateStaffDTO = z.infer<typeof CreateStaffSchema>;
export type CreateStaffRowDTO = z.infer<typeof CreateStaffRowSchema>;
export type CreateAgencyBranchInChargeRowDTO = z.infer<
  typeof CreateAgencyBranchInChargeRowSchema
>;

// * ==========================================================================
// * ===================== UPDATE =============================================
// * ==========================================================================
export type UpdateAddressItemRowDTO = z.infer<
  typeof UpdateAddressItemRowSchema
>;
export type UpdateUserRowDTO = z.infer<typeof UpdateUserRowSchema>;
export type UpdateCustSuppRowDTO = z.infer<typeof UpdateCustSuppRowSchema>;
export type UpdateRoleRowDTO = z.infer<typeof UpdateRoleRowSchema>;
export type UpdateTagRowDTO = z.infer<typeof UpdateTagItemRowSchema>;

// * ==========================================================================
// * ===================== BULK UPDATE ========================================
// * ==========================================================================
export type BulkCreateTagRowDTO = z.infer<typeof BulkCreateTagItemRowSchema>;
export type BulkCreateAddressItemRowDTO = z.infer<
  typeof BulkCreateAddressItemRowSchema
>;
export type BulkUpdateTagItemRowDTO = z.infer<
  typeof BulkUpdateTagItemRowSchema
>;
export type UpdatePriceItemRowDTO = z.infer<typeof UpdatePriceItemRowSchema>;

export type BulkCreatePriceItemRowDTO = z.infer<
  typeof BulkCreatePriceItemRowSchema
>;
