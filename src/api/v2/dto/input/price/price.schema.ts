import { z } from "zod";
import { BaseSchema, BooleanType, StringType } from "../common/common.schema";

export const PriceSchema = BaseSchema.extend({
  price_type: StringType,
  price_description: StringType,
  isImportDefault: BooleanType,
  isSellDefault: BooleanType,
});

export const CreatePriceItemRowSchema = PriceSchema;

export const UpdatePriceItemRowSchema = CreatePriceItemRowSchema.partial();

export const BulkCreatePriceItemRowSchema = z.object({
  prices: CreatePriceItemRowSchema.array(),
});
