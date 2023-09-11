import { z } from "zod";
import { BaseSchema, StringType, UUIDType } from "../common/common.schema";

export const TagSchema = BaseSchema.extend({
  tag_title: StringType,
  tag_description: StringType,
});

export const CreateTagItemRowSchema = TagSchema;
export const UpdateTagItemRowSchema = CreateTagItemRowSchema.extend({
  id: UUIDType,
});
export const BulkCreateTagItemRowSchema = CreateTagItemRowSchema.array();
export const BulkUpdateTagItemRowSchema = z.object({
  tags: UpdateTagItemRowSchema.array(),
});
