import { z } from "zod";
import {
  BulkCreateTagItemRowSchema,
  BulkUpdateTagItemRowSchema,
  TagSchema,
  UpdateTagItemRowSchema,
} from "./tag.schema";

export type ITag = z.infer<typeof TagSchema>;
export type UpdateTagRowDTO = z.infer<typeof UpdateTagItemRowSchema>;
export type BulkCreateTagRowDTO = z.infer<typeof BulkCreateTagItemRowSchema>;
export type BulkUpdateTagItemRowDTO = z.infer<
  typeof BulkUpdateTagItemRowSchema
>;
