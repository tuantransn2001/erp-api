import { BaseSchema, StringType, UUIDType } from "../common/common.schema";

export const DebtSchema = BaseSchema.extend({
  user_id: UUIDType,
  source_id: UUIDType,
  change_debt: StringType,
  debt_amount: StringType,
  debt_note: StringType,
  action: StringType,
});

export const CreateDebtRowSchema = DebtSchema;
