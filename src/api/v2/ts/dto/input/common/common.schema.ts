import { z } from "zod";
export const UUIDType = z.string().uuid({ message: "Invalid UUID" });
export const UUIDArrayType = UUIDType.array();
export const StringType = z.string();
export const StringArrayType = StringType.array();
export const DateType = z.date();
export const BooleanType = z.boolean();
export const NumberType = z.number();
export const BaseStringSchema = StringType;

// ? ================================================
export const CreateRowSchema = BaseStringSchema;

export const CreateAddressItemRowRowSchema = z.object({
  id: UUIDType.optional(),
  user_id: UUIDType.optional(),
  user_province: StringType,
  user_district: StringType,
  user_specific_address: StringType,
});

export const CreateAgencyBranchInChargeRowSchema = z.object({
  id: UUIDType.optional(),
  user_role_id: UUIDType.optional(),
  agency_branch_id: UUIDType,
});

export const CreateUserRowSchema = z.object({
  id: UUIDType.optional(),
  user_phone: StringType,
  user_email: StringType,
  user_name: StringType,
  user_type: StringType.optional(),
  user_password: StringType.optional(),
});

export const CreateCustSuppRowSchema = z.object({
  id: UUIDType.optional(),
  user_id: UUIDType.optional(),
  staff_id: UUIDType,
  staff_in_charge_note: StringType.optional(),
  status: StringType.optional(),
});

export const UpdateUserRowSchema = CreateUserRowSchema.partial().extend({
  id: UUIDType.optional(),
});
export const UpdateCustSuppRowSchema = CreateCustSuppRowSchema.partial().extend(
  {
    id: UUIDType.optional(),
  }
);

export const CreateStaffRowSchema = z.object({
  user_id: StringType.optional(),
  staff_status: StringType.optional(),
  staff_birthday: StringType,
  staff_gender: BooleanType,
  isAllowViewImportNWholesalePrice: BooleanType,
  isAllowViewShippingPrice: BooleanType,
});

export const BulkCreateAddressItemRowSchema =
  CreateAddressItemRowRowSchema.array();

export const UpdateAddressItemRowSchema =
  CreateAddressItemRowRowSchema.partial();

export const CreateTagItemRowSchema = z.object({
  tag_title: StringType,
  tag_description: StringType,
});
export const UpdateTagItemRowSchema = CreateTagItemRowSchema.extend({
  id: UUIDType,
});
export const BulkCreateTagItemRowSchema = CreateTagItemRowSchema.array();
export const BulkUpdateTagItemRowSchema = z.object({
  tags: UpdateTagItemRowSchema.array(),
});

export const CreatePriceItemRowSchema = z.object({
  price_type: StringType,
  price_description: StringType,
  isImportDefault: BooleanType,
  isSellDefault: BooleanType,
});

export const UpdatePriceItemRowSchema = CreatePriceItemRowSchema.partial();

export const BulkCreatePriceItemRowSchema = z.object({
  prices: CreatePriceItemRowSchema.array(),
});

export const CreateDebtRowSchema = z.object({
  user_id: UUIDType,
  source_id: UUIDType,
  change_debt: StringType,
  debt_amount: NumberType,
  debt_note: StringType,
  action: StringType,
});

export const CreateRoleRowSchema = z.object({
  role_title: StringType,
  role_description: StringType,
});
export const UpdateRoleRowSchema = CreateRoleRowSchema.extend({
  id: UUIDType,
});

export const CreateUserRoleRowSchema = z.object({
  id: UUIDType.optional(),
  role_id: UUIDType,
  user_id: UUIDType,
});

export const CreateStaffSchema = CreateUserRowSchema.merge(
  CreateStaffRowSchema
).extend({
  address_list: BulkCreateAddressItemRowSchema,
  roles: z
    .object({
      role_id: StringType,
      agencyBranches_inCharge: StringArrayType,
    })
    .array(),
});
